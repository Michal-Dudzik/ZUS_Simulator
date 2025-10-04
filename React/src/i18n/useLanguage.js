import { useTranslation } from 'react-i18next'

export const useLanguage = () => {
  const { i18n, t } = useTranslation()

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('dmp-language', lang)
  }

  const toggleLanguage = () => {
    const languages = ['pl', 'en', 'ua']
    const currentIndex = languages.indexOf(i18n.language)
    const nextIndex = (currentIndex + 1) % languages.length
    changeLanguage(languages[nextIndex])
  }

  const getLanguageText = () => {
    const languageMap = {
      'en': 'EN',
      'pl': 'PL',
      'ua': 'UA'
    }
    return languageMap[i18n.language] || 'PL'
  }

  const getOtherLanguageText = () => {
    const languages = ['PL', 'EN', 'UA']
    const currentIndex = languages.findIndex(lang => 
      lang === getLanguageText()
    )
    const nextIndex = (currentIndex + 1) % languages.length
    return languages[nextIndex]
  }

  return {
    language: i18n.language,
    changeLanguage,
    toggleLanguage,
    getLanguageText,
    getOtherLanguageText,
    t
  }
} 