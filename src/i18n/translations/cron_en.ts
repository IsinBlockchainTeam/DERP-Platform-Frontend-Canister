import { DefaultLocale } from "react-js-cron";

export const LOCALE_EN: DefaultLocale = {
  everyText: 'every',
  emptyMonths: 'every month',
  emptyMonthDays: 'every day of the month',
  emptyMonthDaysShort: 'day of the month',
  emptyWeekDays: 'every day of the week',
  emptyWeekDaysShort: 'day of the week',
  emptyHours: 'every hour',
  emptyMinutes: 'every minute',
  emptyMinutesForHourPeriod: 'every',
  yearOption: 'year',
  monthOption: 'month',
  weekOption: 'week',
  dayOption: 'day',
  hourOption: 'hour',
  minuteOption: 'minute',
  rebootOption: 'reboot',
  prefixPeriod: 'Every',
  prefixMonths: 'in',
  prefixMonthDays: 'on',
  prefixWeekDays: 'on',
  prefixWeekDaysForMonthAndYearPeriod: 'and',
  prefixHours: 'at',
  prefixMinutes: ':',
  prefixMinutesForHourPeriod: 'at',
  suffixMinutesForHourPeriod: 'minute(s)',
  errorInvalidCron: 'Invalid cron expression',
  clearButtonText: 'Clear',
  weekDays: [
    // Order is important, the index will be used as value
    'Sunday', // Sunday must always be first, it's "0"
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  months: [
    // Order is important, the index will be used as value
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  // Order is important, the index will be used as value
  altWeekDays: [
    'SUN', // Sunday must always be first, it's "0"
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
  ],
  // Order is important, the index will be used as value
  altMonths: [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ],
}

export const CRON_EN = {
  tabs: {
    guided: 'Guided',
    advanced: 'Advanced'
  },
  guided: {
    runEvery: 'Run every:',
    addConstraint: '+ Add',
    timeUnits: {
      second: 'Second',
      minute: 'Minute',
      hour: 'Hour',
      day: 'Day',
      week: 'Week',
      weekday: 'Weekday',
      month: 'Month'
    },
    intervalTypes: {
      at: 'is',
      every: 'Every'
    },
    timeLabels: {
      seconds: 'second(s)',
      minutes: 'minute(s)',
      hours: 'hour(s)',
      days: 'day(s)',
      weeks: 'week(s)',
      months: 'month(s)'
    },
    dayTypes: {
      ofTheMonth: 'of the month',
      ofTheWeek: 'of the week'
    }
  },
  advanced: {
    cronExpression: 'Cron Expression:',
    placeholder: '0 0 8 * * *',
    formatInfo: {
      format: 'Format:',
      formatDescription: 'second minute hour day month weekday',
      examples: 'Examples:',
      example1: 'Every day at 8:00 AM',
      example2: 'Every Monday at 9:30 AM',
      example3: 'Every 30 seconds at 8:00 AM daily',
      example4: 'Every 2 hours'
    }
  },
  weekdays: [
    'Sunday',
    'Monday', 
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  errors: {
    invalidCron: 'Invalid cron expression',
    invalidExpression: 'Invalid Expression'
  }
};