import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useTheme } from '../../../common/hooks/useTheme';
import SectionNavigation from './SectionNavigation';
import './SectionHeader.css';

const SectionHeader = ({ 
  title, 
  date, 
  hyperlinkText, 
  hyperlinkUrl, 
  className = '' 
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`section-header ${isDark ? 'theme-dark' : 'theme-light'} ${className}`}>
      <div className="section-header__content">
        {/* Icon */}
        <div className="section-header__icon">
          <ClockCircleOutlined />
        </div>
        
        {/* Title */}
        <h2 className="section-header__title">
          {title}
        </h2>
        
        {/* Date - only render if date prop exists */}
        {date && (
          <div className="section-header__date">
            <span className="section-header__date-number">{date.day}</span>
            <div className="section-header__date-text">
              <span className="section-header__date-month">{date.month}</span>
              <span className="section-header__date-year">{date.year}</span>
            </div>
          </div>
        )}
        
        {/* Separator line */}
        <div className="section-header__separator"></div>
        
        {/* Hyperlink - only render if hyperlink props exist */}
        {hyperlinkText && hyperlinkUrl && (
          <a 
            href={hyperlinkUrl} 
            className="section-header__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {hyperlinkText}
          </a>
        )}
      </div>
      
      {/* Navigation on the right */}
      <SectionNavigation />
    </div>
  );
};

export default SectionHeader;
