import { useEffect } from 'react'
import { Button, Result, Spin } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const centerStyle = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  boxSizing: 'border-box',
}

const RequireAuth = ({ children }) => {
  const {
    session,
    initializing,
    authLoading,
    isAuthModalOpen,
    openAuthModal,
    isSupabaseConfigured,
  } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (initializing) {
      return
    }

    if (!session && isSupabaseConfigured && !isAuthModalOpen) {
      openAuthModal({ redirectTo: location.pathname })
    }
  }, [initializing, session, isSupabaseConfigured, isAuthModalOpen, openAuthModal, location.pathname])

  if (initializing || authLoading) {
    return (
      <div style={centerStyle}>
        <Spin size="large" />
      </div>
    )
  }

  if (!session) {
    const subTitle = isSupabaseConfigured
      ? 'You need to sign in to access this page.'
      : 'Authentication is not configured yet. Set your Supabase environment variables to enable access.'

    return (
      <div style={centerStyle}>
        <Result
          status="403"
          title="Authentication required"
          subTitle={subTitle}
          extra={(
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {isSupabaseConfigured && (
                <Button type="primary" onClick={() => openAuthModal({ redirectTo: location.pathname })}>
                  Sign in
                </Button>
              )}
              <Button onClick={() => navigate('/')}>Go to home</Button>
            </div>
          )}
        />
      </div>
    )
  }

  return children
}

export default RequireAuth
