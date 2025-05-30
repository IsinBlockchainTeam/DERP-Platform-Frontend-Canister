import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FormControlProps } from './types';
import { TIME_RANGES } from './constants';

export const FormControl = React.memo<FormControlProps>(({ 
  unit, 
  interval, 
  isRequired = false,
  isMonthlyDay = false,
  config,
  updateInterval,
  removeInterval,
  getTimeOptions
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'cron' });
  
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
        onChange={(e) => updateInterval(unit, e.target.value as 'at' | 'every', interval.value)}
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