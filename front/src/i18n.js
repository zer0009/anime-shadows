import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationAR from './locales/ar/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  ar: {
    translation: translationAR
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // default language
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

// Set the initial direction
document.documentElement.dir = i18n.dir();
document.documentElement.lang = i18n.language;

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = i18n.dir();
  document.documentElement.lang = lng;
});

export default i18n;