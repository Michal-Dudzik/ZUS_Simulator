import { useEffect, useMemo, useState } from 'react'
import { Card, Form, Input, Button, Typography, Alert, Result, Spin, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../common/services/supabaseClient.js'
import { useAuth } from '../../../common/contexts/AuthContext.jsx'

const { Title, Paragraph } = Typography

const containerStyle = {
  minHeight: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  boxSizing: 'border-box',
}

const cardStyle = {
  maxWidth: 420,
  width: '100%',
}

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const {
    session,
    isSupabaseConfigured,
    completePasswordReset,
    authLoading,
    error,
    resetError,
  } = useAuth()
  const [form] = Form.useForm()
  const [initializing, setInitializing] = useState(true)
  const [tokenError, setTokenError] = useState(null)
  const [messageApi, contextHolder] = message.useMessage()
  const [linkHandled, setLinkHandled] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => () => {
    resetError?.()
  }, [resetError])

  useEffect(() => {
    let isMounted = true

    const applyRecoveryTokens = async () => {
      if (!isSupabaseConfigured) {
        if (isMounted) {
          setTokenError('Password reset is not available. Authentication is not configured for this project.')
          setInitializing(false)
        }
        return
      }

      if (!supabase) {
        if (isMounted) {
          setTokenError('Password reset is temporarily unavailable. Try again later.')
          setInitializing(false)
        }
        return
      }

      if (typeof window === 'undefined') {
        if (isMounted) {
          setTokenError('Password reset must be completed in a browser window.')
          setInitializing(false)
        }
        return
      }

      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (!isMounted) {
            return
          }

          if (sessionError) {
            setTokenError(sessionError.message || 'Unable to validate the password reset link.')
            setInitializing(false)
            return
          }

          setLinkHandled(true)
          if (window.location.hash) {
            window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`)
          }
          setInitializing(false)
          return
        } catch (setSessionError) {
          if (!isMounted) {
            return
          }
          setTokenError(setSessionError.message || 'Unable to validate the password reset link.')
          setInitializing(false)
          return
        }
      }

      if (session) {
        if (isMounted) {
          setLinkHandled(true)
          setInitializing(false)
        }
        return
      }

      if (isMounted) {
        setTokenError('This password reset link is invalid or has already been used. Request a new link to continue.')
        setInitializing(false)
      }
    }

    applyRecoveryTokens()

    return () => {
      isMounted = false
    }
  }, [isSupabaseConfigured, session])

  const canResetPassword = useMemo(() => {
    if (!isSupabaseConfigured || (!linkHandled && !session)) {
      return false
    }
    return true
  }, [isSupabaseConfigured, linkHandled, session])

  const handleFinish = async ({ password }) => {
    if (!completePasswordReset) {
      messageApi.error('Password reset is not available right now.')
      return
    }

    resetError?.()
    const { error: updateError } = await completePasswordReset({ newPassword: password })
    if (updateError) {
      messageApi.error(updateError.message || 'Unable to update your password right now.')
      return
    }

    setCompleted(true)
    messageApi.success('Your password has been updated.')
    form.resetFields()
  }

  if (!isSupabaseConfigured) {
    return (
      <div style={containerStyle}>
        <Result
          status="warning"
          title="Password reset unavailable"
          subTitle="Authentication is not configured. Contact the site administrator for assistance."
          extra={<Button onClick={() => navigate('/')}>Back to home</Button>}
        />
      </div>
    )
  }

  if (initializing) {
    return (
      <div style={containerStyle}>
        <Spin size="large" />
      </div>
    )
  }

  if (tokenError) {
    return (
      <div style={containerStyle}>
        <Result
          status="error"
          title="Invalid or expired reset link"
          subTitle={tokenError}
          extra={<Button type="primary" onClick={() => navigate('/')}>Back to home</Button>}
        />
      </div>
    )
  }

  if (!canResetPassword) {
    return (
      <div style={containerStyle}>
        <Result
          status="error"
          title="Unable to reset password"
          subTitle="We could not validate your password reset request. Request a new email and try again."
          extra={<Button type="primary" onClick={() => navigate('/')}>Back to home</Button>}
        />
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {contextHolder}
      <Card style={cardStyle}>
        {completed ? (
          <Result
            status="success"
            title="Password updated"
            subTitle="You can now continue to the application."
            extra={[
              <Button type="primary" key="continue" onClick={() => navigate('/admin')}>
                Go to admin panel
              </Button>,
              <Button key="home" onClick={() => navigate('/')}>Back to home</Button>,
            ]}
          />
        ) : (
          <>
            <Title level={4} style={{ marginBottom: 8 }}>Set a new password</Title>
            <Paragraph type="secondary" style={{ marginBottom: 16 }}>
              Choose a strong password to secure your account.
            </Paragraph>
            {error && (
              <Alert
                type="error"
                message={typeof error === 'string' ? error : 'Unable to update password right now.'}
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <Form
              layout="vertical"
              form={form}
              onFinish={handleFinish}
              requiredMark={false}
              preserve={false}
            >
              <Form.Item
                label="New password"
                name="password"
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password autoComplete="new-password" disabled={authLoading} />
              </Form.Item>
              <Form.Item
                label="Confirm new password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your new password' },
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
                <Input.Password autoComplete="new-password" disabled={authLoading} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  disabled={authLoading}
                  loading={authLoading}
                >
                  Update password
                </Button>
              </Form.Item>
            </Form>
            <Button type="link" block onClick={() => navigate('/')}>Cancel</Button>
          </>
        )}
      </Card>
    </div>
  )
}

export default ResetPasswordPage
