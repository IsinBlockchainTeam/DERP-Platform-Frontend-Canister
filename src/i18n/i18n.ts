import en from './translations/en';
import it from './translations/it';
import i18n from 'i18next';
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from 'react-i18next';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: en
        },
        it: {
          translation: it
        }
      },
      fallbackLng: "en",
      interpolation: {
        escapeValue: false
      }
    });

export default i18n;
