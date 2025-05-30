import cronstrue from 'cronstrue/i18n';
import type { CronConfig, TimeUnit, IntervalType } from './types';
import { TIME_UNITS } from './constants';

// Utility functions
export const isValidCron = (cron: string): boolean => {
  try {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 6) return false;
    cronstrue.toString(cron);
    return true;
  } catch {
    return false;
  }
};

export const parseCron = (cron: string): CronConfig => {
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

export const generateCron = (config: CronConfig): string => {
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