import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import ja from "../locales/ja.json"
import my from "../locales/my.json"
import ne from "../locales/ne.json"
import zh from "../locales/zh.json"
import vi from "../locales/vi.json"
import en from "../locales/en.json"
import uz from "../locales/uz.json"
import bn from "../locales/bn.json"
import id from "../locales/id.json"
import ko from "../locales/ko.json"
import th from "../locales/th.json"
import si from "../locales/si.json"

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
      uz: { translation: uz },
      bn: { translation: bn },
      id: { translation: id },
      ko: { translation: ko },
      th: { translation: th },
      si: { translation: si },
    },
    fallbackLng: "ja",
    supportedLngs: ["ja", "my", "ne", "zh", "vi", "en", "uz", "bn", "id", "ko", "th", "si"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "kenketsu-lang",
    },
    interpolation: { escapeValue: false },
  })
  .then(() => {
    document.documentElement.lang = i18n.language?.slice(0, 2) || 'ja'
  })

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng.slice(0, 2)
})

export default i18n
