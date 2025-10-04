import { Modal, Form, Input, Button, Typography } from 'antd'

const { Title, Paragraph } = Typography

const ChangePasswordModal = ({ open, onClose, onSubmit, loading }) => {
  const handleFinish = (values) => {
    onSubmit?.({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    })
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      maskClosable={!loading}
      styles={{ body: { paddingTop: 16 } }}
    >
      <div className="auth-form-wrapper">
        <Title level={4} style={{ marginBottom: 8 }}>Change password</Title>
        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
          Enter your current password and a new password to update your account.
        </Paragraph>
        <Form layout="vertical" onFinish={handleFinish} requiredMark={false} preserve={false}>
          <Form.Item
            label="Current password"
            name="currentPassword"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password autoComplete="current-password" disabled={loading} />
          </Form.Item>
          <Form.Item
            label="New password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password autoComplete="new-password" disabled={loading} />
          </Form.Item>
          <Form.Item
            label="Confirm new password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
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
              Update password
            </Button>
          </Form.Item>
        </Form>
        <Button type="link" block onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

export default ChangePasswordModal
