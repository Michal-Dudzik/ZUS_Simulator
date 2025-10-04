import { useEffect, useState } from 'react'
import { Modal, Form, Input, Button, Typography, message } from 'antd'
import LoginForm from '../../features/adminPanel/components/LoginForm.jsx'

const { Paragraph, Title } = Typography

const VIEWS = {
  LOGIN: 'login',
  REGISTER: 'register',
  RESET: 'reset',
}

const AuthModal = ({
  open,
  onClose,
  loading,
  error,
  onLogin,
  onRegister,
  onResetPassword,
  resetError,
}) => {
  const [view, setView] = useState(VIEWS.LOGIN)
  useEffect(() => {
    if (!open) {
      setView(VIEWS.LOGIN)
      resetError?.()
    }
  }, [open, resetError])

  const handleRegister = async (values) => {
    if (!onRegister) {
      message.info(`Registration coming soon for ${values.email}`)
      onClose()
      return
    }

    const { email, password, nickname } = values
    const { error: registerError } = await onRegister({
      email,
      password,
      nickname,
    })
    if (registerError) {
      message.error(registerError.message || 'Unable to register right now.')
      return
    }

    message.success('Check your inbox to confirm your email address.')
    onClose()
  }

  const handleResetPassword = async (values) => {
    if (!onResetPassword) {
      message.success(`Password reset link sent to ${values.email}`)
      onClose()
      return
    }

    const { error: resetErrorResult } = await onResetPassword({ email: values.email })
    if (resetErrorResult) {
      message.error(resetErrorResult.message || 'Unable to send reset email right now.')
      return
    }

    message.success('Password reset email sent. Check your inbox to continue.')
    onClose()
  }

  const switchView = (nextView) => {
    if (nextView !== view && error) {
      resetError?.()
    }
    setView(nextView)
  }

  const loginView = (
    <LoginForm
      onLogin={onLogin}
      error={error}
      variant="modal"
      loading={loading}
      onForgotPassword={() => switchView(VIEWS.RESET)}
      onRegister={() => switchView(VIEWS.REGISTER)}
    />
  )

  const registerView = (
    <div className="auth-form-wrapper">
      <Title level={4} style={{ marginBottom: 8 }}>Register</Title>
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Create a new account to access restricted features.
      </Paragraph>
      <Form layout="vertical" onFinish={handleRegister} requiredMark={false}>
        <Form.Item
          label="Nickname"
          name="nickname"
          rules={[{ required: true, message: 'Please enter your nickname' }]}
        >
          <Input placeholder="Jane" autoComplete="nickname" disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="jane@example.com" autoComplete="email" disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please create a password' }]}
        >
          <Input.Password autoComplete="new-password" disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Passwords do not match'))
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" disabled={loading} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block disabled={loading} loading={loading}>
            Register
          </Button>
        </Form.Item>
      </Form>
      <Button type="link" block onClick={() => switchView(VIEWS.LOGIN)}>
        Back to login
      </Button>
    </div>
  )

  const resetView = (
    <div className="auth-form-wrapper">
      <Title level={4} style={{ marginBottom: 8 }}>Reset password</Title>
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Enter your email address and we will send you reset instructions.
      </Paragraph>
      <Form layout="vertical" onFinish={handleResetPassword} requiredMark={false}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="jane@example.com" autoComplete="email" disabled={loading} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block disabled={loading} loading={loading}>
            Send reset link
          </Button>
        </Form.Item>
      </Form>
      <Button type="link" block onClick={() => switchView(VIEWS.LOGIN)}>
        Back to login
      </Button>
    </div>
  )

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      styles={{ body: { paddingTop: 16 } }}
    >
      {view === VIEWS.LOGIN && loginView}
      {view === VIEWS.REGISTER && registerView}
      {view === VIEWS.RESET && resetView}
    </Modal>
  )
}

export default AuthModal
