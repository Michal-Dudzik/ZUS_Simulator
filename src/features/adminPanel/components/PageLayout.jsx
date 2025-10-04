import React from 'react';
import { Typography, Card, theme } from 'antd';

const { Title } = Typography;
const { useToken } = theme;

const PageLayout = ({ icon: IconComponent, title, children, cardClassName = "", cardStyles = {} }) => {
    const { token } = useToken();

    return (
        <div 
            className="page-container" 
            style={{ 
                height: 'calc(var(--actual-viewport-height, 100vh) - var(--header-height) - var(--footer-height) - 35px)', 
                display: 'flex', 
                flexDirection: 'column', 
                padding: 0 
            }}
        >
            <div className="page-header" style={{ marginBottom: 24, flexShrink: 0 }}>
                <Title level={2} className="page-title" style={{ margin: 0 }}>
                    {IconComponent && <IconComponent style={{ marginRight: 12, color: token.colorPrimary }} />}
                    {title}
                </Title>
            </div>

            <Card 
                className={`page-content-card ${cardClassName}`}
                style={{ 
                    flex: 1, 
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    ...cardStyles
                }}
                styles={{
                    body: { 
                        flex: 1, 
                        overflow: 'auto', 
                        padding: 24,
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#d4d4d4 #f1f1f1'
                    }
                }}
            >
                {children}
            </Card>
        </div>
    );
};

export default PageLayout; 