import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Space, Typography } from 'antd';
import { LeftOutlined, RightOutlined, PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useTheme } from '../../../common/hooks/useTheme';
import { getThemeDefinition } from '../../../styles/theme';
import NewsCard from './NewsCard';
import './NewsCarousel.css';

const { Title } = Typography;

const NewsCarousel = ({ articles, title = "Aktualności" }) => {
  const { isDark } = useTheme();
  const theme = getThemeDefinition(isDark ? 'dark' : 'light');
  const colors = theme.colors;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  const cardsPerView = 3;
  const maxIndex = useMemo(() => Math.max(0, articles.length - cardsPerView), [articles.length, cardsPerView]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoPlaying && !isHovered) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
      }, 4000); // Change every 4 seconds
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isHovered, maxIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? maxIndex : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className="news-carousel-container"
      style={{
        '--primary-color': colors.primary,
        '--secondary-color': colors.secondary,
        '--accent-color': colors.accent,
        '--background-color': colors.background,
        '--surface-color': colors.surface,
        '--text-color': colors.text,
        '--text-secondary-color': colors.textSecondary,
        '--border-color': colors.border
      }}
    >
      <div className="news-carousel-header">
        <Title 
          level={3} 
          style={{ 
            margin: 0, 
            color: colors.text,
            fontSize: '1.5rem',
            fontWeight: 600
          }}
        >
          {title}
        </Title>
        <Space>
          <Button
            type="text"
            icon={isAutoPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
            onClick={toggleAutoPlay}
            style={{
              color: colors.primary,
              fontSize: '1.2rem',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </Space>
      </div>

      <div 
        className="news-carousel-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={goToPrevious}
          className="carousel-nav-button carousel-nav-left"
          style={{
            color: colors.primary,
            fontSize: '1.5rem',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        />

        <div 
          ref={carouselRef}
          className="news-carousel-track"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          {articles.map((article, index) => (
            <div 
              key={article.id} 
              className="news-carousel-slide"
              style={{
                width: `${100 / cardsPerView}%`,
                padding: '0 8px'
              }}
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>

        <Button
          type="text"
          icon={<RightOutlined />}
          onClick={goToNext}
          className="carousel-nav-button carousel-nav-right"
          style={{
            color: colors.primary,
            fontSize: '1.5rem',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        />
      </div>

      {/* Dots indicator */}
      <div className="carousel-dots">
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            style={{
              backgroundColor: index === currentIndex ? colors.primary : colors.border,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              margin: '0 4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsCarousel;
