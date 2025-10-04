import React from 'react';
import { Card } from 'antd';
import { useTheme } from '../../common/hooks/useTheme';
import { getThemeDefinition } from '../../styles/theme';
import NewsCarousel from './components/NewsCarousel';
import { newsArticles } from './newsData';
import './NewsSection.css';

const NewsSection = () => {
  const { isDark } = useTheme();
  const theme = getThemeDefinition(isDark ? 'dark' : 'light');
  const colors = theme.colors;

  return (
    <Card
      className="news-section"
      style={{
        margin: '2rem 0',
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
          padding: 0
        }
      }}
    >
      <NewsCarousel 
        articles={newsArticles} 
        title="Przydatne artykuły o systemie emerytalnym"
      />
    </Card>
  );
};

export default NewsSection;
