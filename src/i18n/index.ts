// i18n setup — initialises react-i18next with English only
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    fallbackLng: 'en',
    supportedLngs: ['en'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;



// // i18n setup — initialises react-i18next with en/hi/or locales
// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

// import en from './locales/en.json';
// import hi from './locales/hi.json';
// import or from './locales/or.json';

// void i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: { translation: en },
//       hi: { translation: hi },
//       or: { translation: or },
//     },
//     fallbackLng: 'en',
//     supportedLngs: ['en', 'hi', 'or'],
//     interpolation: { escapeValue: false },
//     detection: {
//       order: ['localStorage', 'navigator'],
//       caches: ['localStorage'],
//     },
//   });

// export default i18n;


