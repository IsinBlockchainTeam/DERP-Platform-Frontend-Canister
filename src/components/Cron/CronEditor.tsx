import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import cronstrue from 'cronstrue/i18n';

// Import separated components and utilities
import type { CronEditorProps, CronConfig, TimeUnit, IntervalType } from './types';
import { TIME_UNITS, TIME_RANGES } from './constants';
import { isValidCron, parseCron, generateCron } from './utils';
import { TabSwitcher } from './TabSwitcher';
import { GuidedMode } from './GuidedMode';
import { AdvancedMode } from './AdvancedMode';
import { CronStatus } from './CronStatus';

export default function CronEditor({ value, onChange, onValidationChange, className = '', title }: CronEditorProps) {
  const { t, i18n } = useTranslation(undefined, { keyPrefix: 'cron' });
  
  const [activeTab, setActiveTab] = useState<'guided' | 'advanced'>('guided');
  const [rawExpression, setRawExpression] = useState(value || '');
  const isInitializing = useRef(true);
  const onChangeRef = useRef(onChange);
  const onValidationChangeRef = useRef(onValidationChange);
  
  // Keep refs updated
  useEffect(() => {
    onChangeRef.current = onChange;
    onValidationChangeRef.current = onValidationChange;
  });
  
  // Parse initial state from value prop
  const initialConfig = useMemo(() => 
    value ? parseCron(value) : { baseUnit: 'day' as TimeUnit, intervals: { hour: { type: 'at' as IntervalType, value: 8 } } }
  , [value]);
  
  const [config, setConfig] = useState<CronConfig>(initialConfig);
  
  // Initialize and sync with value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setRawExpression(value);
      setConfig(parseCron(value));
    }
    // Mark initialization as complete after first render
    isInitializing.current = false;
  }, [value]);
  
  // Current cron expression based on active tab
  const cronExpression = useMemo(() => 
    activeTab === 'guided' ? generateCron(config) : rawExpression
  , [activeTab, config, rawExpression]);
  
  const isValid = useMemo(() => isValidCron(cronExpression), [cronExpression]);
  
  // Get human-readable description
  const description = useMemo(() => {
    try {
      if (cronExpression.trim().split(/\s+/).length !== 6) return t('errors.invalidCron');
      return cronstrue.toString(cronExpression, { 
        use24HourTimeFormat: true,
        verbose: false,
        locale: i18n.language
      });
    } catch {
      return t('errors.invalidCron');
    }
  }, [cronExpression, i18n.language, t]);

  // Sync with parent (prevent circular updates)
  useEffect(() => {
    if (!isInitializing.current) {
      onChangeRef.current?.(cronExpression);
      onValidationChangeRef.current?.(isValid);
    }
  }, [cronExpression, isValid]);

  // Update config when switching to advanced mode with valid cron
  useEffect(() => {
    if (activeTab === 'advanced' && isValid && rawExpression && !isInitializing.current) {
      setConfig(parseCron(rawExpression));
    }
  }, [activeTab, rawExpression, isValid]);

  // Generate time options for dropdowns
  const getTimeOptions = useCallback((unit: TimeUnit) => {
    const [min, max] = TIME_RANGES[unit];
    return Array.from({ length: max - min + 1 }, (_, i) => {
      const value = min + i;
      let label = value.toString();
      
      if (unit === 'week') {
        const days = t('weekdays', { returnObjects: true }) as string[];
        label = `${value} (${days[value]})`;
      } else if (unit === 'month') {
        const months = t('months', { returnObjects: true }) as string[];
        label = `${value} (${months[value - 1]})`;
      } else if (unit === 'hour') {
        label = `${value.toString().padStart(2, '0')}`;
      }
      
      return { value, label };
    });
  }, [t]);

  // Update interval with conflict handling
  const updateInterval = useCallback((unit: TimeUnit, type: IntervalType, value: number) => {
    setConfig(prev => {
      const newIntervals = { ...prev.intervals };
      
      // Handle day/week conflicts
      if (unit === 'week' && prev.baseUnit !== 'month') delete newIntervals.day;
      if (unit === 'day' && prev.baseUnit !== 'month') delete newIntervals.week;
      
      newIntervals[unit] = { type, value: Math.max(type === 'every' ? 1 : 0, value) };
      return { ...prev, intervals: newIntervals };
    });
  }, []);

  const removeInterval = useCallback((unit: TimeUnit) => {
    // Note: With the new approach, all sub-units always have intervals for UI consistency
    // This function is kept for the special case of monthly day/week switching
    if (config.baseUnit === 'week' && unit === 'week') return;
    setConfig(prev => {
      const { [unit]: removed, ...intervals } = prev.intervals;
      return { ...prev, intervals };
    });
  }, [config.baseUnit]);

  const updateBaseUnit = useCallback((newBase: TimeUnit) => {
    const baseIdx = TIME_UNITS.indexOf(newBase);
    setConfig(prev => {
      const intervals = { ...prev.intervals };
      
      // Remove intervals >= base unit
      (Object.keys(intervals) as TimeUnit[]).forEach(unit => {
        if (TIME_UNITS.indexOf(unit) >= baseIdx) {
          delete intervals[unit];
        }
      });
      
      // Special handling for week base unit
      if (newBase === 'week') {
        if (prev.baseUnit !== 'month') delete intervals.day;
        if (!intervals.week) intervals.week = { type: 'at', value: 1 };
      }
      
      // Add default constraints for all sub-units to ensure a complete schedule
      const subUnitList = TIME_UNITS.slice(0, baseIdx);
      subUnitList.forEach(unit => {
        // Skip adding day constraint if we already have week (to avoid conflicts)
        if (unit === 'day' && (intervals.week || newBase === 'week')) return;
        
        // Only add if not already defined
        if (!intervals[unit]) {
          let defaultValue: number;
          
          switch (unit) {
            case 'second':
            case 'minute':
            case 'hour':
              defaultValue = 0;
              break;
            case 'day':
            case 'week':
            case 'month':
              defaultValue = 1;
              break;
            default:
              defaultValue = 0;
          }
          
          intervals[unit] = { type: 'at', value: defaultValue };
        }
      });
      
      return { baseUnit: newBase, intervals };
    });
  }, []);

  return (
    <div className={`bg-base-100 border border-base-300 rounded-lg p-4 ${className}`}>
      <div className="space-y-3">
        {/* Header with tabs */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">{title}</h3>
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {activeTab === 'guided' ? (
          <GuidedMode
            config={config}
            updateBaseUnit={updateBaseUnit}
            updateInterval={updateInterval}
            removeInterval={removeInterval}
            getTimeOptions={getTimeOptions}
          />
        ) : (
          <AdvancedMode
            rawExpression={rawExpression}
            setRawExpression={setRawExpression}
          />
        )}
        
        {/* Status and description */}
        <CronStatus isValid={isValid} description={description} />
      </div>
    </div>
  );
}
