// Types for cron configuration
export type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month';
export type IntervalType = 'at' | 'every';

export interface CronConfig {
  baseUnit: TimeUnit;
  intervals: Partial<Record<TimeUnit, { type: IntervalType; value: number }>>;
}

export interface CronEditorProps {
  value?: string;
  onChange?: (cronExpression: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  className?: string;
  title?: string;
}

export interface FormControlProps {
  unit: TimeUnit;
  interval: { type: IntervalType; value: number };
  isRequired?: boolean;
  isMonthlyDay?: boolean;
  config: CronConfig;
  updateInterval: (unit: TimeUnit, type: IntervalType, value: number) => void;
  removeInterval: (unit: TimeUnit) => void;
  getTimeOptions: (unit: TimeUnit) => { value: number; label: string }[];
}

export interface GuidedModeProps {
  config: CronConfig;
  updateBaseUnit: (newBase: TimeUnit) => void;
  updateInterval: (unit: TimeUnit, type: IntervalType, value: number) => void;
  removeInterval: (unit: TimeUnit) => void;
  getTimeOptions: (unit: TimeUnit) => { value: number; label: string }[];
}

export interface AdvancedModeProps {
  rawExpression: string;
  setRawExpression: (expression: string) => void;
}

export interface TabSwitcherProps {
  activeTab: 'guided' | 'advanced';
  setActiveTab: (tab: 'guided' | 'advanced') => void;
} 