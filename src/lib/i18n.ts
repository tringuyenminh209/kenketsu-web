import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import ja from "../locales/ja.json"
import my from "../locales/my.json"
import ne from "../locales/ne.json"
import zh from "../locales/zh.json"
import vi from "../locales/vi.json"
import en from "../locales/en.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      my: { translation: my },
      ne: { translation: ne },
      zh: { translation: zh },
      vi: { translation: vi },
      en: { translation: en },
    },
    fallbackLng: "ja",
    supportedLngs: ["ja", "my", "ne", "zh", "vi", "en"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "kenketsu-lang",
    },
    interpolation: { escapeValue: false },
  })

export default i18n
