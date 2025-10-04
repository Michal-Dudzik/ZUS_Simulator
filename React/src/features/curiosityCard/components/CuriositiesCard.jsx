import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTheme } from '../../../common/hooks/useTheme';
import { getThemeDefinition } from '../../../styles/theme';
import './CuriositiesCard.css';

const curiositiesData = [
  {
    id: 1,
    title: "Historia emerytur w Polsce",
    content: "Pierwszy system emerytalny w Polsce został wprowadzony w 1927 roku i obejmował tylko pracowników państwowych. Obecny system ZUS działa od 1999 roku.",
    icon: "📚"
  },
  {
    id: 2,
    title: "Wiek emerytalny",
    content: "W Polsce kobiety mogą przejść na emeryturę w wieku 60 lat, a mężczyźni w wieku 65 lat. To jeden z najniższych wieków emerytalnych w Europie.",
    icon: "🎂"
  },
  {
    id: 3,
    title: "Trzy filary systemu",
    content: "Polski system emerytalny składa się z trzech filarów: I filar (ZUS), II filar (OFE) i III filar (IKE, IKZE). Każdy ma inne zasady i korzyści podatkowe.",
    icon: "🏛️"
  },
  {
    id: 4,
    title: "Wysokość emerytury",
    content: "Średnia emerytura w Polsce wynosi około 2500 zł brutto. Najniższa emerytura to 1200 zł brutto, a najwyższa może przekraczać 15 000 zł.",
    icon: "💰"
  },
  {
    id: 5,
    title: "Demografia a emerytury",
    content: "W 2023 roku na 100 osób w wieku produkcyjnym przypadało 30 emerytów. Do 2050 roku będzie to już 50 emerytów na 100 pracujących.",
    icon: "📊"
  },
  {
    id: 6,
    title: "Emerytury rolnicze",
    content: "KRUS (Kasa Rolniczego Ubezpieczenia Społecznego) wypłaca emerytury rolnicze. Średnia emerytura rolnicza to około 1000 zł miesięcznie.",
    icon: "🚜"
  },
  {
    id: 7,
    title: "Wcześniejsza emerytura",
    content: "Można przejść na wcześniejszą emeryturę, ale wtedy otrzymuje się niższą kwotę. Za każdy rok wcześniejszego przejścia emerytura zmniejsza się o 3,6%.",
    icon: "⏰"
  },
  {
    id: 8,
    title: "Emerytury za granicą",
    content: "Polscy emeryci mieszkający za granicą mogą otrzymywać emeryturę na konto bankowe w Polsce lub bezpośrednio za granicą.",
    icon: "🌍"
  }
];

const { Title, Text } = Typography;

const CuriositiesCard = () => {
  const { isDark } = useTheme();
  const [currentCuriosity, setCurrentCuriosity] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Get theme colors
  const theme = getThemeDefinition(isDark ? 'dark' : 'light');
  const colors = theme.colors;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentCuriosity((prev) => (prev + 1) % curiositiesData.length);
        setIsVisible(true);
      }, 300);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentData = curiositiesData[currentCuriosity];

  const goToPrevious = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentCuriosity((prev) => (prev - 1 + curiositiesData.length) % curiositiesData.length);
      setIsVisible(true);
    }, 150);
  };

  const goToNext = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentCuriosity((prev) => (prev + 1) % curiositiesData.length);
      setIsVisible(true);
    }, 150);
  };

  return (
    <Card
      className="curiosities-card"
      style={{
        height: '200px',
        margin: '1rem 0',
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
          height: '100%', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: '1rem', flexShrink: 0 }}>
        <Col>
          <Title level={4} style={{ margin: 0, color: colors.text }}>
            Ciekawostki o systemie emerytalnym
          </Title>
        </Col>
        <Col>
          <Space>
            {curiositiesData.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentCuriosity ? 'active' : ''}`}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: index === currentCuriosity ? colors.primary : colors.border,
                  transition: 'all 0.3s ease',
                  transform: index === currentCuriosity ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </Space>
        </Col>
      </Row>
      
      <div className="curiosities-navigation" style={{ flex: 1, position: 'relative', minHeight: '120px' }}>
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={goToPrevious}
          className="nav-button nav-button-left"
          style={{
            position: 'absolute',
            left: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            color: colors.primary,
            fontSize: '2rem',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'none'
          }}
        />
        
        <div 
          className={`curiosities-content ${isVisible ? 'visible' : 'hidden'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '0 40px',
            minHeight: '120px',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              fontSize: '2rem',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            {currentData.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Title level={5} style={{ margin: '0 0 0.5rem 0', color: colors.text, lineHeight: 1.4 }}>
              {currentData.title}
            </Title>
            <Text style={{ color: colors.textSecondary, lineHeight: 1.5, fontSize: '0.95rem' }}>
              {currentData.content}
            </Text>
          </div>
        </div>
        
        <Button
          type="text"
          icon={<RightOutlined />}
          onClick={goToNext}
          className="nav-button nav-button-right"
          style={{
            position: 'absolute',
            right: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            color: colors.primary,
            fontSize: '2rem',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'none'
          }}
        />
      </div>
    </Card>
  );
};

export default CuriositiesCard;
