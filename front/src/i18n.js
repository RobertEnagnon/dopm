import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from 'i18next-browser-languagedetector';
import { Language } from "./services/enums/Language";
import translationEN from "./i18n/en.json";
import translationFR from "./i18n/fr.json";
import translationSP from "./i18n/sp.json";

let defaultLanguage = Language.FR;

// the translations
const resources = {
  english: {
    translation: translationEN,
  },
  french: {
    translation: translationFR,
  },
  spanish: {
    translation: translationSP,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: defaultLanguage,

    keySeparator: ".", // to support nested translations

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
