import { useContext } from 'react'
import { themeContext } from '../contexts/ThemeContext.jsx'

export function useTheme() {
  const context = useContext(themeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
