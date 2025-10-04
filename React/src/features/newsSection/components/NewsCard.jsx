import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTheme } from '../../../common/hooks/useTheme';
import { getThemeDefinition } from '../../../styles/theme';
import './NewsCard.css';

const { Title, Text } = Typography;

const NewsCard = ({ article }) => {
  const { isDark } = useTheme();
  const theme = getThemeDefinition(isDark ? 'dark' : 'light');
  const colors = theme.colors;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card
      className="news-card"
      hoverable
      style={{
        width: '100%',
        height: '100%',
        '--primary-color': colors.primary,
        '--secondary-color': colors.secondary,
        '--accent-color': colors.accent,
        '--background-color': colors.background,
        '--surface-color': colors.surface,
        '--text-color': colors.text,
        '--text-secondary-color': colors.textSecondary,
        '--border-color': colors.border
      }}
      styles={{
        body: {
          padding: '1.5rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >

      
      <div className="news-card-content">
        <div className="news-card-header">
          <Tag 
            color={colors.primary}
            style={{ 
              margin: 0,
              fontSize: '0.75rem',
              fontWeight: 500
            }}
          >
            {article.category}
          </Tag>
        </div>
        
        <Title 
          level={4} 
          className="news-card-title"
          style={{ 
            color: colors.text,
            margin: '0.75rem 0',
            lineHeight: 1.3,
            fontSize: '1.1rem'
          }}
        >
          {article.title}
        </Title>
        
        <Text 
          className="news-card-excerpt"
          style={{ 
            color: colors.textSecondary,
            lineHeight: 1.5,
            fontSize: '0.9rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {article.excerpt}
        </Text>
        
        <div className="news-card-footer">
          <Space size="small" style={{ fontSize: '0.8rem', color: colors.textSecondary }}>
            <Space size={4}>
              <CalendarOutlined />
              <span>{formatDate(article.date)}</span>
            </Space>
            <Space size={4}>
              <ClockCircleOutlined />
              <span>{article.readTime}</span>
            </Space>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
