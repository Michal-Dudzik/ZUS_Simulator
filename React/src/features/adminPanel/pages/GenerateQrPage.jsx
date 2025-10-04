import { Card, Typography, Button, Row, Col, Form, Input, Select, Alert } from 'antd';
import { ToolOutlined, DownloadOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageLayout from '../components/PageLayout';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

function ToolsPage() {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const handleEmailSubmit = (values) => {
        console.log('Email tool values:', values);
        // Placeholder for email functionality
    };

    const handleExportData = () => {
        console.log('Exporting data...');
        // Placeholder for data export functionality
    };

    const handleSystemCheck = () => {
        console.log('Running system check...');
        // Placeholder for system check functionality
    };

    return (
        <PageLayout 
            icon={ToolOutlined}
            title={t('admin.tools.title')}
            cardClassName="tools-page-content"
        >
            {/* Page Description */}
            <Alert
                message={t('admin.tools.welcome.title')}
                description={t('admin.tools.welcome.description')}
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />

            <Row gutter={[24, 24]}>
                {/* Email Tool */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <span>
                                <SendOutlined style={{ marginRight: 8 }} />
                                {t('admin.tools.email.title')}
                            </span>
                        }
                    >
                        <Paragraph type="secondary">
                            {t('admin.tools.email.description')}
                        </Paragraph>
                        
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleEmailSubmit}
                        >
                            <Form.Item
                                label={t('admin.tools.email.recipient')}
                                name="recipient"
                                rules={[
                                    { required: true, message: t('admin.tools.email.recipientRequired') },
                                    { type: 'email', message: t('admin.tools.email.recipientInvalid') }
                                ]}
                            >
                                <Input placeholder={t('admin.tools.email.recipientPlaceholder')} />
                            </Form.Item>

                            <Form.Item
                                label={t('admin.tools.email.subject')}
                                name="subject"
                                rules={[{ required: true, message: t('admin.tools.email.subjectRequired') }]}
                            >
                                <Input placeholder={t('admin.tools.email.subjectPlaceholder')} />
                            </Form.Item>

                            <Form.Item
                                label={t('admin.tools.email.template')}
                                name="template"
                            >
                                <Select placeholder={t('admin.tools.email.templatePlaceholder')}>
                                    <Option value="welcome">{t('admin.tools.email.templates.welcome')}</Option>
                                    <Option value="notification">{t('admin.tools.email.templates.notification')}</Option>
                                    <Option value="reminder">{t('admin.tools.email.templates.reminder')}</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    htmlType="submit"
                                    icon={<SendOutlined />}
                                >
                                    {t('admin.tools.email.send')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Data Export Tool */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <span>
                                <DownloadOutlined style={{ marginRight: 8 }} />
                                {t('admin.tools.export.title')}
                            </span>
                        }
                    >
                        <Paragraph type="secondary">
                            {t('admin.tools.export.description')}
                        </Paragraph>
                        
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>{t('admin.tools.export.availableFormats')}</Text>
                            <ul style={{ marginTop: 8 }}>
                                <li>CSV - {t('admin.tools.export.formats.csv')}</li>
                                <li>JSON - {t('admin.tools.export.formats.json')}</li>
                                <li>Excel - {t('admin.tools.export.formats.excel')}</li>
                            </ul>
                        </div>

                        <Button 
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleExportData}
                            size="large"
                            style={{ width: '100%' }}
                        >
                            {t('admin.tools.export.button')}
                        </Button>
                    </Card>
                </Col>

                {/* System Tools */}
                <Col xs={24}>
                    <Card 
                        title={
                            <span>
                                <SettingOutlined style={{ marginRight: 8 }} />
                                {t('admin.tools.system.title')}
                            </span>
                        }
                    >
                        <Paragraph type="secondary">
                            {t('admin.tools.system.description')}
                        </Paragraph>
                        
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={8}>
                                <Button 
                                    onClick={handleSystemCheck}
                                    size="large"
                                    style={{ width: '100%' }}
                                >
                                    {t('admin.tools.system.healthCheck')}
                                </Button>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Button 
                                    size="large"
                                    style={{ width: '100%' }}
                                >
                                    {t('admin.tools.system.clearCache')}
                                </Button>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Button 
                                    size="large"
                                    style={{ width: '100%' }}
                                >
                                    {t('admin.tools.system.backup')}
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </PageLayout>
    );
}

export default ToolsPage; 