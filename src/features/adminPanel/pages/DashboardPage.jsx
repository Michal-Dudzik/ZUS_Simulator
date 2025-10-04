import React from 'react';
import { Typography, Row, Col, Statistic, Card, Alert } from 'antd';
import { DashboardOutlined, UserOutlined, FileTextOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageLayout from '../components/PageLayout';

const { Title, Text, Paragraph } = Typography;

const DashboardPage = () => {
    const { t } = useTranslation();

    return (
        <PageLayout 
            icon={DashboardOutlined}
            title={t('admin.dashboard.title')}
            cardClassName="dashboard-page-card"
        >
            {/* Welcome Section */}
            <div style={{ marginBottom: 32 }}>
                <Alert
                    message={t('admin.dashboard.welcome.title')}
                    description={t('admin.dashboard.welcome.description')}
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
            </div>

            {/* Sample Statistics */}
            <div style={{ marginBottom: 32 }}>
                <Title level={4} style={{ marginBottom: 16 }}>
                    {t('admin.dashboard.statistics.title')}
                </Title>
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={6} md={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                            <Statistic
                                title={t('admin.dashboard.statistics.totalUsers')}
                                value={1234}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                            <Statistic
                                title={t('admin.dashboard.statistics.totalPosts')}
                                value={567}
                                prefix={<FileTextOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                            <Statistic
                                title={t('admin.dashboard.statistics.activeUsers')}
                                value={89}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                            <Statistic
                                title={t('admin.dashboard.statistics.systemHealth')}
                                value={98}
                                suffix="%"
                                prefix={<SettingOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Recent Activity */}
            <div style={{ marginBottom: 32 }}>
                <Title level={4} style={{ marginBottom: 16 }}>
                    {t('admin.dashboard.recentActivity.title')}
                </Title>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <BellOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        <Text>{t('admin.dashboard.recentActivity.item1')}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <UserOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                        <Text>{t('admin.dashboard.recentActivity.item2')}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SettingOutlined style={{ marginRight: 8, color: '#faad14' }} />
                        <Text>{t('admin.dashboard.recentActivity.item3')}</Text>
                    </div>
                </Card>
            </div>

            {/* Template Information */}
            <div>
                <Title level={4} style={{ marginBottom: 16 }}>
                    {t('admin.dashboard.templateInfo.title')}
                </Title>
                <Card>
                    <Paragraph>
                        {t('admin.dashboard.templateInfo.description')}
                    </Paragraph>
                    <ul>
                        <li>{t('admin.dashboard.templateInfo.feature1')}</li>
                        <li>{t('admin.dashboard.templateInfo.feature2')}</li>
                        <li>{t('admin.dashboard.templateInfo.feature3')}</li>
                        <li>{t('admin.dashboard.templateInfo.feature4')}</li>
                    </ul>
                </Card>
            </div>
        </PageLayout>
    );
};

export default DashboardPage;