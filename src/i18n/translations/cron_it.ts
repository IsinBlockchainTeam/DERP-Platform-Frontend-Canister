import { DefaultLocale } from "react-js-cron";

export const LOCALE_IT: DefaultLocale = {
  everyText: 'ogni',
  emptyMonths: 'ogni mese',
  emptyMonthDays: 'ogni giorno del mese',
  emptyMonthDaysShort: 'giorno del mese',
  emptyWeekDays: 'ogni giorno della settimana',
  emptyWeekDaysShort: 'giorno della settimana',
  emptyHours: 'ogni ora',
  emptyMinutes: 'ogni minuto',
  emptyMinutesForHourPeriod: 'ogni',
  yearOption: 'anno',
  monthOption: 'mese',
  weekOption: 'settimana',
  dayOption: 'giorno',
  hourOption: 'ora',
  minuteOption: 'minuto',
  rebootOption: 'riavvio',
  prefixPeriod: 'Ogni',
  prefixMonths: 'in',
  prefixMonthDays: 'il',
  prefixWeekDays: 'il',
  prefixWeekDaysForMonthAndYearPeriod: 'e',
  prefixHours: 'alle',
  prefixMinutes: ':',
  prefixMinutesForHourPeriod: 'al',
  suffixMinutesForHourPeriod: 'minuto/i',
  errorInvalidCron: 'Espressione cron non valida',
  clearButtonText: 'Pulisci',
  weekDays: [
    'Domenica', // Sunday must always be first, it's "0"
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
  ],
  months: [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ],
  altWeekDays: [
    'DOM', // Sunday must always be first, it's "0"
    'LUN',
    'MAR',
    'MER',
    'GIO',
    'VEN',
    'SAB',
  ],
  altMonths: [
    'GEN',
    'FEB',
    'MAR',
    'APR',
    'MAG',
    'GIU',
    'LUG',
    'AGO',
    'SET',
    'OTT',
    'NOV',
    'DIC',
  ],
};

export const CRON_IT = {
  tabs: {
    guided: 'Guidata',
    advanced: 'Avanzata'
  },
  guided: {
    runEvery: 'Esegui ogni:',
    addConstraint: '+ Aggiungi',
    timeUnits: {
      second: 'Secondo',
      minute: 'Minuto',
      hour: 'Ora',
      day: 'Giorno',
      week: 'Settimana',
      weekday: 'Giorno della settimana',
      month: 'Mese'
    },
    intervalTypes: {
      at: 'è',
      every: 'Ogni'
    },
    timeLabels: {
      seconds: 'secondo/i',
      minutes: 'minuto/i',
      hours: 'ora/e',
      days: 'giorno/i',
      weeks: 'settimana/e',
      months: 'mese/i'
    },
    dayTypes: {
      ofTheMonth: 'del mese',
      ofTheWeek: 'della settimana'
    }
  },
  advanced: {
    cronExpression: 'Espressione Cron:',
    placeholder: '0 0 8 * * *',
    formatInfo: {
      format: 'Formato:',
      formatDescription: 'secondo minuto ora giorno mese giorno_settimana',
      examples: 'Esempi:',
      example1: 'Ogni giorno alle 8:00',
      example2: 'Ogni lunedì alle 9:30',
      example3: 'Ogni 30 secondi alle 8:00 quotidianamente',
      example4: 'Ogni 2 ore'
    }
  },
  weekdays: [
    'Domenica',
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato'
  ],
  months: [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre'
  ],
  errors: {
    invalidCron: 'Espressione cron non valida',
    invalidExpression: 'Espressione Non Valida'
  }
};