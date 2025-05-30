import type { TimeUnit } from './types';

export const TIME_UNITS: TimeUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month'];

export const TIME_RANGES = {
  second: [0, 59], 
  minute: [0, 59], 
  hour: [0, 23], 
  day: [1, 31], 
  week: [0, 6], 
  month: [1, 12]
} as const; 