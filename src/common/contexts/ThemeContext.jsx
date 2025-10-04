/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo } from 'react'
import { ConfigProvider } from 'antd'
import {
  buildTheme,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_THEME_KEY,
  THEME_KEYS,
  getThemeDefinition,
} from '../../styles/theme.js'

const ThemeContext = createContext()
ThemeContext.displayName = 'ThemeContext'

export const themeContext = ThemeContext

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_THEME_KEY
    }
    const saved = window.localStorage.getItem('dmp-theme')
    return THEME_KEYS.includes(saved) ? saved : DEFAULT_THEME_KEY
  })
  const [primaryColor, setPrimaryColor] = useState(() => {
    const definition = getThemeDefinition(themeKey)
    return definition.colors.primary ?? DEFAULT_PRIMARY_COLOR
  })

  useEffect(() => {
    const definition = getThemeDefinition(themeKey)
    const nextPrimary = definition.colors.primary ?? DEFAULT_PRIMARY_COLOR
    setPrimaryColor(prev => (prev === nextPrimary ? prev : nextPrimary))
  }, [themeKey])

  const { config: currentTheme, tokens, definition } = useMemo(
    () => buildTheme({ themeKey, primary: primaryColor }),
    [themeKey, primaryColor],
  )

  const isDark = definition.mode === 'dark'

  const toggleTheme = () => {
    setThemeKey(prev => {
      const currentIndex = THEME_KEYS.indexOf(prev)
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % THEME_KEYS.length
      return THEME_KEYS[nextIndex]
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.setItem('dmp-theme', themeKey)
  }, [themeKey])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement
    root.style.setProperty('--brand-color-primary', definition.colors.primary)
    root.style.setProperty('--brand-background', definition.colors.background)
    root.style.setProperty('--brand-surface', definition.colors.surface)
    root.style.setProperty('--brand-surface-elevated', definition.colors.surfaceElevated ?? definition.colors.surface)
    root.style.setProperty('--brand-text-color', definition.colors.text)
    root.style.setProperty('--brand-text-secondary', definition.colors.textSecondary)
    root.style.setProperty('--brand-border-color', definition.colors.border)
  }, [definition])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement
    root.style.setProperty('--ant-color-primary', tokens.colorPrimary)
    root.style.setProperty('--ant-color-primary-hover', tokens.colorPrimaryHover)
    root.style.setProperty('--ant-color-primary-active', tokens.colorPrimaryActive)
    root.style.setProperty('--text-color', tokens.colorText)
    root.style.setProperty('--text-color-secondary', tokens.colorTextSecondary)
    root.style.setProperty('--app-background-color', tokens.colorBgLayout)
    root.style.setProperty('--card-background-color', tokens.colorBgContainer)
  }, [tokens])

  return (
    <ThemeContext.Provider value={{
      themeKey,
      isDark,
      setThemeKey,
      toggleTheme,
      primaryColor,
      setPrimaryColor,
      tokens,
      definition,
      availableThemes: THEME_KEYS,
    }}>
      <ConfigProvider theme={currentTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}
