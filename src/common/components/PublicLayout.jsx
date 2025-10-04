import { useEffect, useMemo, useState } from 'react'
import { Layout, Button, Dropdown, message } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import AppHeader from './AppHeader.jsx'
import AppFooter from './AppFooter.jsx'
import AuthModal from './AuthModal.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import '../../styles/App.css'
import ChangePasswordModal from './ChangePasswordModal.jsx'

const { Content } = Layout

const PublicLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [messageApi, contextHolder] = message.useMessage()
  const {
    session,
    loading,
    authLoading,
    error,
    signInWithPassword,
    signOut,
    resetError,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signUpWithPassword,
    sendPasswordReset,
    consumePendingRedirect,
    changePassword,
  } = useAuth()

  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false)

  const userMetadata = session?.user?.user_metadata || {}
  const userDisplayName = userMetadata.nickname || userMetadata.name || session?.user?.email
  const userMenuLabel = userDisplayName || 'Account'
  const userInitials = useMemo(() => {
    if (!userMenuLabel) {
      return '?'
    }

    const names = userMenuLabel.trim().split(/\s+/)
    return names
      .slice(0, 2)
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
  }, [userMenuLabel])

  const navItems = useMemo(() => ([
    { key: '/', label: 'Home' },
    { key: '/admin', label: 'Admin Panel' },
  ]), [])

  const userMenuItems = useMemo(() => ([
    { key: 'changePassword', label: 'Change Password' },
    { key: 'logout', label: 'Logout' },
  ]), [])

  const selectedKeys = useMemo(() => {
    const currentPath = location.pathname
    const match = [...navItems]
      .sort((a, b) => b.key.length - a.key.length)
      .find(item => currentPath === item.key || currentPath.startsWith(`${item.key}/`))
    return match ? [match.key] : []
  }, [location.pathname, navItems])

  useEffect(() => {
    if (!session) {
      setChangePasswordOpen(false)
      return
    }

    if (isAuthModalOpen) {
      closeAuthModal()
    }

    if (!consumePendingRedirect) {
      return
    }

    const redirectTo = consumePendingRedirect()
    if (redirectTo && redirectTo !== location.pathname) {
      navigate(redirectTo, { replace: true })
    }
  }, [
    session,
    isAuthModalOpen,
    closeAuthModal,
    consumePendingRedirect,
    navigate,
    location.pathname,
  ])

  const handleNavigate = (key) => {
    navigate(key)
  }

  const handleUserMenuClick = async (key) => {
    if (key === 'changePassword') {
      setChangePasswordOpen(true)
      return
    }

    if (key === 'logout') {
      const { error: logoutError } = await signOut()
      if (logoutError) {
        messageApi.error(logoutError.message || 'Unable to log out right now.')
        return
      }

      messageApi.success('Logged out.')
    }
  }

  const handleChangePasswordSubmit = async ({ currentPassword, newPassword }) => {
    if (!changePassword) {
      messageApi.error('Change password is not available right now.')
      return
    }

    resetError?.()
    const { error: changeError } = await changePassword({ currentPassword, newPassword })
    if (changeError) {
      messageApi.error(changeError.message || 'Unable to change password right now.')
      return
    }

    messageApi.success('Password updated.')
    setChangePasswordOpen(false)
  }

  const headerActions = (
    <div className="header-actions-group public-header-actions">
      <div className="public-nav-buttons">
        {navItems.map(item => (
          <Button
            key={item.key}
            type="text"
            className={`public-nav-button${selectedKeys.includes(item.key) ? ' active' : ''}`}
            onClick={() => handleNavigate(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      {session ? (
        <div className="user-actions-row">
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: ({ key }) => handleUserMenuClick(key),
            }}
            trigger={['click']}
            placement="bottomRight"
            overlayClassName="user-menu-dropdown"
          >
            <button
              type="button"
              className="user-menu-trigger"
              title={userMenuLabel}
              aria-label="User menu"
            >
              <span className="user-menu-avatar" aria-hidden>
                {userInitials}
              </span>
              <span className="user-menu-label">{userMenuLabel}</span>
              <DownOutlined className="user-menu-caret" />
            </button>
          </Dropdown>
        </div>
      ) : (
        <Button
          type="primary"
          onClick={() => openAuthModal()}
          disabled={loading}
          loading={loading}
        >
          Log in
        </Button>
      )}
    </div>
  )

  const headerLogo = (
    <Link to="/" className="public-logo">
      React Template
    </Link>
  )

  return (
    <Layout className="app-layout">
      {contextHolder}
      <AppHeader leftActions={headerLogo} actions={headerActions} />
      <Content className="app-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </Content>
      <AppFooter />
      <AuthModal
        open={isAuthModalOpen}
        onClose={closeAuthModal}
        loading={loading}
        error={error}
        onLogin={signInWithPassword}
        onRegister={signUpWithPassword}
        onResetPassword={sendPasswordReset}
        resetError={resetError}
      />
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => {
          if (!authLoading) {
            setChangePasswordOpen(false)
          }
        }}
        onSubmit={handleChangePasswordSubmit}
        loading={authLoading}
      />
    </Layout>
  )
}

export default PublicLayout
