import { Button, Input, Form, Typography, Layout, Alert, Card } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './../styles/adminPage.css';

const { Title } = Typography;

function LoginForm({
    onLogin,
    error,
    variant = 'page',
    loading = false,
    onForgotPassword,
    onRegister,
}) {
    const { t } = useTranslation();
    const heading = 'Authentication';

    const form = (
        <Form
            name="admin_login"
            onFinish={onLogin}
            layout="vertical"
        >
            <Form.Item
                label={t('admin.emailLabel')}
                name="email"
                rules={[{ required: true, message: t('admin.emailRequired') }]}
            >
                <Input
                    prefix={<MailOutlined />}
                    placeholder={t('admin.emailLabel')}
                    disabled={loading}
                />
            </Form.Item>
            <Form.Item
                label={t('admin.passwordLabel')}
                name="password"
                rules={[{ required: true, message: t('admin.passwordRequired') }]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder={t('admin.passwordLabel')}
                    disabled={loading}
                />
            </Form.Item>
            {variant === 'modal' && onForgotPassword && (
                <Form.Item className="auth-inline-action">
                    <Button type="link" onClick={onForgotPassword} disabled={loading}>
                        Forgot password?
                    </Button>
                </Form.Item>
            )}
            {error && <Alert message={error} type="error" showIcon className="login-error-alert" />}
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-button"
                    loading={loading}
                    disabled={loading}
                >
                    {t('admin.loginButton')}
                </Button>
            </Form.Item>
            {variant === 'modal' && onRegister && (
                <Form.Item className="auth-inline-action">
                    <Button type="link" onClick={onRegister} disabled={loading}>
                        Need an account? Register
                    </Button>
                </Form.Item>
            )}
        </Form>
    );

    if (variant === 'modal') {
        return (
            <div className="auth-form-wrapper">
                <Title level={4} style={{ marginBottom: 8 }}>
                    {heading}
                </Title>
                {form}
            </div>
        );
    }

    return (
        <Layout className="login-container">
            <Card title={<Title level={2}>{heading}</Title>} className="login-card">
                {form}
            </Card>
        </Layout>
    );
}

export default LoginForm;
