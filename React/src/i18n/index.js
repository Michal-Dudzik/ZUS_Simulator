import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslations from './en.json'
import plTranslations from './pl.json'
import uaTranslations from './ua.json'

const resources = {
  en: {
    translation: enTranslations
  },
  pl: {
    translation: plTranslations
  },
  ua: {
    translation: uaTranslations
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('dmp-language') || 'pl',
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n 