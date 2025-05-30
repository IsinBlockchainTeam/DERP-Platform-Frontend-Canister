import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import cronstrue from 'cronstrue/i18n';

// Types for cron configuration
type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month';
type IntervalType = 'at' | 'every';

interface CronConfig {
  baseUnit: TimeUnit;
  intervals: Partial<Record<TimeUnit, { type: IntervalType; value: number }>>;
}

interface CronEditorProps {
  value?: string;
  onChange?: (cronExpression: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  className?: string;
  title?: string;
}

interface FormControlProps {
  unit: TimeUnit;
  interval: { type: IntervalType; value: number };
  isRequired?: boolean;
  isMonthlyDay?: boolean;
  config: CronConfig;
  updateInterval: (unit: TimeUnit, type: IntervalType, value: number) => void;
  removeInterval: (unit: TimeUnit) => void;
  t: ReturnType<typeof useTranslation>['t'];
  getTimeOptions: (unit: TimeUnit) => { value: number; label: string }[];
}

const TIME_UNITS: TimeUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month'];
const TIME_RANGES = {
  second: [0, 59], minute: [0, 59], hour: [0, 23], 
  day: [1, 31], week: [0, 6], month: [1, 12]
} as const;

// Utility functions
const isValidCron = (cron: string): boolean => {
  try {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 6) return false;
    cronstrue.toString(cron);
    return true;
  } catch {
    return false;
  }
};

const parseCron = (cron: string): CronConfig => {
  const defaultConfig = { baseUnit: 'day' as TimeUnit, intervals: { hour: { type: 'at' as IntervalType, value: 8 } } };
  
  try {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 6) return defaultConfig;
    
    const unitMap = ['second', 'minute', 'hour', 'day', 'month', 'week'] as TimeUnit[];
    const intervals: CronConfig['intervals'] = {};
    
    // Parse each part to extract intervals
    parts.forEach((part, i) => {
      const unit = unitMap[i];
      if (part !== '*' && part !== '?') {
        const isInterval = part.includes('/');
        const value = parseInt(isInterval ? part.split('/')[1] : part);
        if (!isNaN(value) && value >= 0) {
          intervals[unit] = { type: isInterval ? 'every' : 'at', value };
        }
      }
    });
    
    // Determine the base unit by finding the highest-level constraint or repetition pattern
    // The base unit represents the "container" or primary frequency
    let baseUnit: TimeUnit = 'day'; // default
    
    // Priority order: month > week > day > hour > minute > second
    
    // Check for month-based patterns
    if (intervals.month) {
      baseUnit = 'month';
    }
    // Check for week-based patterns (week day specified OR day is '?' indicating week-based scheduling)
    else if (intervals.week || parts[3] === '?') {
      baseUnit = 'week';
    }
    // Check for day-based patterns (specific day or day interval)
    else if (intervals.day) {
      baseUnit = 'day';
    }
    // Check for hour-based patterns
    else if (intervals.hour) {
      // If hour has "every" pattern and higher units are wildcards, base is day (run every day at hour X)
      if (intervals.hour.type === 'every' && parts[3] === '*' && parts[4] === '*' && parts[5] === '*') {
        baseUnit = 'day';
      }
      // If hour has specific time and higher units are wildcards, base is day (daily at specific hour)
      else if (intervals.hour.type === 'at' && parts[3] === '*' && parts[4] === '*' && parts[5] === '*') {
        baseUnit = 'day';
      }
      else {
        baseUnit = 'day'; // fallback for mixed patterns
      }
    }
    // Check for minute-based patterns
    else if (intervals.minute) {
      // If minute has "every" pattern and higher units are wildcards, base is hour (run every hour at minute X)
      if (intervals.minute.type === 'every' && 
          parts[2] === '*' && parts[3] === '*' && parts[4] === '*' && parts[5] === '*') {
        baseUnit = 'hour';
      }
      // If minute has specific time and higher units are wildcards, base is hour (hourly at specific minute)
      else if (intervals.minute.type === 'at' && 
               parts[2] === '*' && parts[3] === '*' && parts[4] === '*' && parts[5] === '*') {
        baseUnit = 'hour';
      }
      else {
        baseUnit = 'day'; // fallback for mixed patterns
      }
    }
    // Check for second-based patterns
    else if (intervals.second) {
      // If second has "every" pattern and higher units are wildcards, base is minute
      if (intervals.second.type === 'every' && 
          parts[1] === '*' && parts[2] === '*' && parts[3] === '*' && parts[4] === '*' && parts[5] === '*') {
        baseUnit = 'minute';
      }
      // If second has specific time and higher units are wildcards, base is minute (every minute at specific second)
      else if (intervals.second.type === 'at' && 
               parts[1] === '*' && parts[2] === '*' && parts[3] === '*' && parts[4] === '*' && parts[5] === '*') {
        baseUnit = 'minute';
      }
      else {
        baseUnit = 'day'; // fallback for mixed patterns
      }
    }
    
    // Ensure all sub-units of the baseUnit are represented as intervals for UI consistency
    const baseIdx = TIME_UNITS.indexOf(baseUnit);
    const subUnits = TIME_UNITS.slice(0, baseIdx);
    
    subUnits.forEach((unit, i) => {
      const partIdx = unitMap.indexOf(unit);
      const part = parts[partIdx];
      
      // Skip day if we have week (day/week conflict)
      if (unit === 'day' && (intervals.week || baseUnit === 'week')) return;
      
      // If not already defined, add default constraint
      if (!intervals[unit]) {
        if (part === '*') {
          // Wildcard means "every 1" in the UI
          intervals[unit] = { type: 'every', value: 1 };
        } else if (part === '?') {
          // '?' is only used for day field in week-based schedules, skip it
          return;
        } else {
          // Default to a reasonable starting value
          let defaultValue: number;
          switch (unit) {
            case 'second':
            case 'minute':
              defaultValue = 0;
              break;
            case 'hour':
              defaultValue = 0;
              break;
            case 'day':
              defaultValue = 1;
              break;
            case 'week':
              defaultValue = 1; // Monday
              break;
            case 'month':
              defaultValue = 1;
              break;
            default:
              defaultValue = 0;
          }
          intervals[unit] = { type: 'at', value: defaultValue };
        }
      }
    });
    
    // Special handling for week-based schedules
    if (baseUnit === 'week' && !intervals.week) {
      intervals.week = { type: 'at', value: 1 }; // Default to Monday
    }
    
    return { baseUnit, intervals };
  } catch {
    return defaultConfig;
  }
};

const generateCron = (config: CronConfig): string => {
  const parts = ['*', '*', '*', '*', '*', '*'];
  const indices = { second: 0, minute: 1, hour: 2, day: 3, month: 4, week: 5 };
  
  Object.entries(config.intervals).forEach(([unit, interval]) => {
    if (!interval) return;
    const idx = indices[unit as TimeUnit];
    
    if (interval.type === 'at') {
      parts[idx] = interval.value.toString();
    } else if (interval.type === 'every') {
      // For 'every' intervals, always use explicit interval syntax to avoid ambiguous wildcards
      // This prevents parseCron from incorrectly inferring base units during editing
      const min = unit === 'day' || unit === 'month' ? 1 : 0;
      parts[idx] = `${min}/${interval.value}`;
    }
  });
  
  // Handle day/week conflicts
  if (config.intervals.week) {
    // When we have a week constraint, day should be '?'
    parts[3] = '?';
  }
  if (config.baseUnit === 'week' && !config.intervals.week) {
    parts[5] = '1';
    parts[3] = '?';
  }
  
  return parts.join(' ');
};

// Reusable form control component (moved outside to prevent recreation on each render)
const FormControl = React.memo<FormControlProps>(({ 
  unit, 
  interval, 
  isRequired = false,
  isMonthlyDay = false,
  config,
  updateInterval,
  removeInterval,
  getTimeOptions
}) => {
    const { t } = useTranslation(undefined, {
      keyPrefix: 'cron'
  })
  const displayName = isMonthlyDay ? t('guided.timeUnits.day') : (unit === 'week' ? t('guided.timeUnits.weekday') : t(`guided.timeUnits.${unit}`));
  const timeOptions = getTimeOptions(unit);
  
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-base-50 rounded border border-base-200">
      <span className="text-xs font-medium min-w-12 text-gray-600">{displayName}:</span>
      
      {isMonthlyDay && (
        <select 
          className="select select-bordered select-xs"
          value={config.intervals.day ? 'month' : 'week'}
          onChange={(e) => {
            const newType = e.target.value as 'month' | 'week';
            const targetUnit = newType === 'month' ? 'day' : 'week';
            updateInterval(targetUnit, interval.type, interval.value);
            if (newType === 'month') removeInterval('week');
            else removeInterval('day');
          }}
        >
          <option value="month">{t('guided.dayTypes.ofTheMonth')}</option>
          <option value="week">{t('guided.dayTypes.ofTheWeek')}</option>
        </select>
      )}
      
      <select 
        className="select select-bordered select-xs"
        value={interval.type}
        onChange={(e) => updateInterval(unit, e.target.value as IntervalType, interval.value)}
      >
        <option value="at">{t('guided.intervalTypes.at')}</option>
        <option value="every">{t('guided.intervalTypes.every')}</option>
      </select>
      
      {interval.type === 'at' ? (
        <select 
          className="select select-bordered select-xs"
          value={interval.value}
          onChange={(e) => updateInterval(unit, interval.type, parseInt(e.target.value))}
        >
          {timeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <div className="flex items-center gap-1">
          <input 
            type="number"
            className="input input-bordered input-xs w-14"
            min={1}
            max={TIME_RANGES[unit][1]}
            value={interval.value}
            onChange={(e) => updateInterval(unit, interval.type, Math.max(1, parseInt(e.target.value) || 1))}
          />
          <span className="text-xs text-gray-500">{t(`guided.timeLabels.${unit}s`)}</span>
        </div>
      )}
    </div>
  );
});

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
  }, [cronExpression, i18n.language]);

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

  const updateBaseUnit = (newBase: TimeUnit) => {
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
              defaultValue = 0;
              break;
            case 'hour':
              defaultValue = 0;
              break;
            case 'day':
              defaultValue = 1;
              break;
            case 'week':
              defaultValue = 1; // Monday
              break;
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
  };

  // Get available sub-units
  const subUnits = useMemo((): TimeUnit[] => {
    const baseIdx = TIME_UNITS.indexOf(config.baseUnit);
    const units = TIME_UNITS.slice(0, baseIdx).reverse();
    
    if (config.baseUnit === 'week') return [...units.filter(u => u !== 'day'), 'week' as TimeUnit];
    if (config.baseUnit === 'month') return units;
    return config.intervals.week ? units.filter(u => u !== 'day') : units;
  }, [config.baseUnit, config.intervals.week]);

  return (
    <div className={`bg-base-100 border border-base-300 rounded-lg p-4 ${className}`}>
      <div className="space-y-3">
        {/* Header with tabs */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">{title}</h3>
          <div className="flex rounded-md bg-gray-100 p-1">
            {(['guided', 'advanced'] as const).map(tab => (
              <button 
                key={tab}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  activeTab === tab 
                    ? 'bg-white text-gray-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'guided' ? (
          <>
            {/* Base unit selection */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium min-w-16">{t('guided.runEvery')}</label>
              <select 
                className="select select-bordered select-sm w-32"
                value={config.baseUnit}
                onChange={(e) => updateBaseUnit(e.target.value as TimeUnit)}
              >
                {TIME_UNITS.map(unit => (
                  <option key={unit} value={unit}>{t(`guided.timeUnits.${unit}`)}</option>
                ))}
              </select>
            </div>

            {/* Sub-unit configuration */}
            {subUnits.length > 0 && (
              <div className="space-y-2">
                {subUnits.map(unit => {
                  // Special handling for monthly day configuration
                  if (config.baseUnit === 'month' && (unit === 'day' || unit === 'week')) {
                    // Only render once for day/week combo, skip the week iteration
                    if (unit === 'week') return null;
                    
                    const interval = config.intervals.day || config.intervals.week;
                    const targetUnit = config.intervals.day ? 'day' : 'week';
                    
                    // Skip if no interval exists (shouldn't happen with new parseCron logic)
                    if (!interval) return null;
                    
                    return (
                      <FormControl 
                        key="monthly-day" 
                        unit={targetUnit}
                        interval={interval} 
                        isMonthlyDay={true}
                        config={config}
                        updateInterval={updateInterval}
                        removeInterval={removeInterval}
                        t={t}
                        getTimeOptions={getTimeOptions}
                      />
                    );
                  }
                  
                  const interval = config.intervals[unit];
                  const isRequired = config.baseUnit === 'week' && unit === 'week';
                  
                  // Skip if interval doesn't exist (shouldn't happen with new parseCron logic)
                  if (!interval) return null;
                  
                  return (
                    <FormControl 
                      key={unit} 
                      unit={unit} 
                      interval={interval} 
                      isRequired={isRequired}
                      config={config}
                      updateInterval={updateInterval}
                      removeInterval={removeInterval}
                      t={t}
                      getTimeOptions={getTimeOptions}
                    />
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Advanced mode */
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium min-w-16">{t('advanced.cronExpression')}</label>
              <input 
                type="text"
                className="input input-bordered input-sm font-mono flex-1"
                value={rawExpression}
                onChange={(e) => setRawExpression(e.target.value)}
                placeholder={t('advanced.placeholder')}
              />
            </div>
            
            {/* Format info */}
            <div className="text-xs text-gray-400 bg-base-50 border border-base-200 rounded p-2">
              <div><span className="font-medium">{t('advanced.formatInfo.format')}</span> {t('advanced.formatInfo.formatDescription')}</div>
              <div className="mt-1"><span className="font-medium">{t('advanced.formatInfo.examples')}</span></div>
              <div className="ml-2 mt-1 space-y-0.5">
                <div><code>0 0 8 * * *</code> - {t('advanced.formatInfo.example1')}</div>
                <div><code>0 30 9 ? * 1</code> - {t('advanced.formatInfo.example2')}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Description */}
        <div className={`text-xs p-2 rounded border transition-all duration-300 ease-in-out ${
          isValid 
            ? 'text-gray-500 bg-blue-50 border-blue-200' 
            : 'text-red-600 bg-red-50 border-red-200 shadow-sm'
        }`}>
          {!isValid && (
            <div className="flex items-center gap-1.5 mb-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="font-medium">{t('errors.invalidExpression')}</span>
            </div>
          )}
          <div className={isValid ? '' : 'ml-4.5'}>
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
