import { useEffect, useState } from 'react'
import { message } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import AuthModal from './AuthModal.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import '../../styles/App.css'
import ChangePasswordModal from './ChangePasswordModal.jsx'

const PublicLayout = () => {
  const navigate = useNavigate()
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
    closeAuthModal,
    signUpWithPassword,
    sendPasswordReset,
    consumePendingRedirect,
    changePassword,
  } = useAuth()

  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false)

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
    if (redirectTo) {
      navigate(redirectTo, { replace: true })
    }
  }, [
    session,
    isAuthModalOpen,
    closeAuthModal,
    consumePendingRedirect,
    navigate,
  ])

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

  return (
    <div className="app-layout">
      {contextHolder}
      <div className="app-content">
        <Outlet />
      </div>
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
    </div>
  )
}

export default PublicLayout
