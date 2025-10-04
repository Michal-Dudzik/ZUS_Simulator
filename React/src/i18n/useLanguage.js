import { useTranslation } from 'react-i18next'

export const useLanguage = () => {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'pl' : 'en'
    i18n.changeLanguage(newLanguage)
    localStorage.setItem('dmp-language', newLanguage)
  }

  const getLanguageText = () => {
    return i18n.language === 'en' ? 'EN' : 'PL'
  }

  const getOtherLanguageText = () => {
    return i18n.language === 'en' ? 'PL' : 'EN'
  }

  return {
    language: i18n.language,
    toggleLanguage,
    getLanguageText,
    getOtherLanguageText,
    t
  }
} 