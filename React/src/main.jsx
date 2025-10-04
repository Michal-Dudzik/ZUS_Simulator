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
