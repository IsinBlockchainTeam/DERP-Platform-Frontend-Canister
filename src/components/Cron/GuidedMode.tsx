import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { GuidedModeProps } from './types';
import { TIME_UNITS } from './constants';
import { FormControl } from './FormControl';

export const GuidedMode: React.FC<GuidedModeProps> = ({
  config,
  updateBaseUnit,
  updateInterval,
  removeInterval,
  getTimeOptions
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'cron' });

  // Get available sub-units
  const subUnits = useMemo(() => {
    const baseIdx = TIME_UNITS.indexOf(config.baseUnit);
    const units = TIME_UNITS.slice(0, baseIdx).reverse();
    
    if (config.baseUnit === 'week') return [...units.filter(u => u !== 'day'), 'week' as const];
    if (config.baseUnit === 'month') return units;
    return config.intervals.week ? units.filter(u => u !== 'day') : units;
  }, [config.baseUnit, config.intervals.week]);

  return (
    <>
      {/* Base unit selection */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium min-w-16">{t('guided.runEvery')}</label>
        <select 
          className="select select-bordered select-sm w-32"
          value={config.baseUnit}
          onChange={(e) => updateBaseUnit(e.target.value as any)}
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
                getTimeOptions={getTimeOptions}
              />
            );
          })}
        </div>
      )}
    </>
  );
}; 