import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './common/contexts/ThemeContext.jsx'
import { AuthProvider } from './common/contexts/AuthContext.jsx'
import { Spin } from 'antd'
import { Toaster } from 'react-hot-toast'
import './i18n'
import './styles/index.css'
import { router } from './router.jsx'
import ErrorBoundary from './common/components/ErrorBoundary.jsx'
import i18n from './i18n'

// Listen for language changes from mainIndex.html
window.addEventListener('languageChange', (event) => {
  const { language } = event.detail
  console.log('Language change event received:', language) // Debug log
  i18n.changeLanguage(language).then(() => {
    console.log('Language changed to:', language) // Debug log
    // Force a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('i18nLanguageChanged', { 
      detail: { language } 
    }))
  })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <RouterProvider router={router} fallbackElement={<Spin size="large" />} />
        </ErrorBoundary>
        <Toaster toastOptions={{ duration: 5000 }} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
