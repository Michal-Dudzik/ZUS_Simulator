import React, { useState } from 'react';
import { Card, Button, Progress, Tag, Alert } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  SmileOutlined,
  TrophyOutlined,
  HomeOutlined,
  CarOutlined,
  GlobalOutlined,
  HeartOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import './LifestyleComparison.css';

// Predefined lifestyle options with monthly costs
const lifestyleOptions = [
  {
    id: 'minimal',
    name: 'Podstawowe potrzeby',
    icon: <HomeOutlined />,
    monthlyCost: 2500,
    description: 'Podstawowe wydatki - mieszkanie, jedzenie, opieka zdrowotna',
    items: [
      'Czynsz i media: 800 zł',
      'Jedzenie: 1000 zł',
      'Transport publiczny: 200 zł',
      'Opieka zdrowotna: 300 zł',
      'Pozostałe: 200 zł'
    ],
    color: '#52c41a'
  },
  {
    id: 'comfortable',
    name: 'Komfortowy styl życia',
    icon: <SmileOutlined />,
    monthlyCost: 4000,
    description: 'Komfortowe życie z okazjonalnymi przyjemnościami',
    items: [
      'Podstawowe potrzeby: 2500 zł',
      'Rozrywka i hobby: 600 zł',
      'Drobne podróże: 400 zł',
      'Restauracje i kultura: 300 zł',
      'Oszczędności awaryjne: 200 zł'
    ],
    color: '#1890ff'
  },
  {
    id: 'active',
    name: 'Aktywny emeryt',
    icon: <HeartOutlined />,
    monthlyCost: 5000,
    description: 'Aktywność fizyczna, sport, regularne wyjścia',
    items: [
      'Komfortowy styl: 4000 zł',
      'Siłownia/basen: 300 zł',
      'Aktywności fizyczne: 300 zł',
      'Wyjścia towarzyskie: 400 zł'
    ],
    color: '#722ed1'
  },
  {
    id: 'traveling',
    name: 'Podróżnik',
    icon: <GlobalOutlined />,
    monthlyCost: 6000,
    description: 'Regularne podróże krajowe i zagraniczne',
    items: [
      'Komfortowy styl: 4000 zł',
      'Podróże (2-3 razy/rok): 1500 zł',
      'Ubezpieczenia turystyczne: 200 zł',
      'Sprzęt i akcesoria: 300 zł'
    ],
    color: '#fa8c16'
  },
  {
    id: 'luxury',
    name: 'Luksusowy styl życia',
    icon: <TrophyOutlined />,
    monthlyCost: 8000,
    description: 'Premium jakość życia, regularne podróże, rozrywka',
    items: [
      'Aktywny emeryt: 5000 zł',
      'Luksusowe podróże: 2000 zł',
      'Premium rozrywka: 500 zł',
      'Zakupy i przyjemności: 500 zł'
    ],
    color: '#eb2f96'
  },
  {
    id: 'supportive',
    name: 'Wspierający rodzinę',
    icon: <ShoppingOutlined />,
    monthlyCost: 5500,
    description: 'Wsparcie finansowe dla dzieci i wnuków',
    items: [
      'Komfortowy styl: 4000 zł',
      'Wsparcie dla rodziny: 1000 zł',
      'Prezenty i okazje: 500 zł'
    ],
    color: '#13c2c2'
  }
];

const LifestyleComparison = ({ projectedPension, totalCapitalAccumulated }) => {
  const [selectedLifestyle, setSelectedLifestyle] = useState('comfortable');

  const selectedOption = lifestyleOptions.find(opt => opt.id === selectedLifestyle);
  const difference = projectedPension - selectedOption.monthlyCost;
  const coveragePercent = Math.min(100, (projectedPension / selectedOption.monthlyCost) * 100);
  
  const getStatusInfo = () => {
    if (difference >= 0) {
      return {
        type: 'success',
        icon: <CheckCircleOutlined />,
        message: 'Twoja emerytura pokrywa ten styl życia!',
        detail: `Pozostaje Ci ${difference.toLocaleString('pl-PL')} zł miesięcznie na dodatkowe wydatki lub oszczędności.`
      };
    } else {
      const shortfall = Math.abs(difference);
      const yearsToRetirement = 30; // This could be calculated from user data
      const additionalCapitalNeeded = shortfall * 12 * 18; // 18 years life expectancy
      const monthlyContributionNeeded = additionalCapitalNeeded / (yearsToRetirement * 12);
      
      return {
        type: 'warning',
        icon: <WarningOutlined />,
        message: 'Twoja emerytura nie pokrywa w pełni tego stylu życia',
        detail: `Brakuje ${shortfall.toLocaleString('pl-PL')} zł miesięcznie. Aby osiągnąć ten poziom, rozważ dodatkowe oszczędności emerytalne (np. IKE, IKZE) lub zwiększenie składek ZUS o ok. ${monthlyContributionNeeded.toLocaleString('pl-PL')} zł miesięcznie.`
      };
    }
  };

  const statusInfo = getStatusInfo();

  const getAlternativeLifestyles = () => {
    if (difference >= 0) {
      // Show what more expensive lifestyles user could potentially achieve
      return lifestyleOptions
        .filter(opt => opt.monthlyCost > selectedOption.monthlyCost && opt.monthlyCost <= projectedPension)
        .slice(0, 2);
    } else {
      // Show more affordable alternatives
      return lifestyleOptions
        .filter(opt => opt.monthlyCost < selectedOption.monthlyCost && opt.monthlyCost <= projectedPension)
        .slice(-2);
    }
  };

  const alternatives = getAlternativeLifestyles();

  return (
    <Card className="lifestyle-comparison-card">
      <div className="lifestyle-header">
        <h2>
          <CarOutlined /> Wybierz Swój Przyszły Styl Życia
        </h2>
        <p className="lifestyle-subtitle">
          Sprawdź, czy Twoja przyszła emerytura wystarczy na wymarzony styl życia
        </p>
      </div>

      <div className="lifestyle-options-grid">
        {lifestyleOptions.map(option => {
          const canAfford = projectedPension >= option.monthlyCost;
          const isSelected = selectedLifestyle === option.id;
          
          return (
            <Button
              key={option.id}
              className={`lifestyle-option ${isSelected ? 'selected' : ''} ${canAfford ? 'affordable' : 'not-affordable'}`}
              onClick={() => setSelectedLifestyle(option.id)}
              style={{
                borderColor: isSelected ? option.color : undefined,
                backgroundColor: isSelected ? `${option.color}15` : undefined
              }}
            >
              <div className="lifestyle-option-content">
                <div className="lifestyle-icon" style={{ color: option.color }}>
                  {option.icon}
                </div>
                <div className="lifestyle-name">{option.name}</div>
                <div className="lifestyle-cost">
                  {option.monthlyCost.toLocaleString('pl-PL')} zł/mies.
                </div>
                {canAfford && (
                  <Tag color="success" className="affordable-tag">
                    <CheckCircleOutlined /> Możliwe
                  </Tag>
                )}
              </div>
            </Button>
          );
        })}
      </div>

      <div className="lifestyle-analysis">
        <Card className="selected-lifestyle-card" style={{ border: `4px solid ${selectedOption.color}` }}>
          <div className="selected-lifestyle-header">
            <div className="selected-lifestyle-icon" style={{ color: selectedOption.color }}>
              {selectedOption.icon}
            </div>
            <div>
              <h3>{selectedOption.name}</h3>
              <p>{selectedOption.description}</p>
            </div>
          </div>

          <div className="cost-breakdown">
            <h4>Przewidywane miesięczne wydatki:</h4>
            <ul>
              {selectedOption.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <div className="total-cost">
              <strong>Razem: {selectedOption.monthlyCost.toLocaleString('pl-PL')} zł/miesiąc</strong>
            </div>
          </div>

          <div className="coverage-visualization">
            <div className="coverage-header">
              <span>Twoja emerytura: <strong>{projectedPension.toLocaleString('pl-PL')} zł</strong></span>
              <span>Pokrycie: <strong>{coveragePercent.toFixed(0)}%</strong></span>
            </div>
            <Progress
              percent={coveragePercent}
              status={difference >= 0 ? 'success' : 'exception'}
              strokeColor={difference >= 0 ? '#52c41a' : '#ff4d4f'}
              showInfo={false}
            />
          </div>

          <Alert
            message={statusInfo.message}
            description={statusInfo.detail}
            type={statusInfo.type}
            icon={statusInfo.icon}
            showIcon
            className="status-alert"
          />
        </Card>

        {alternatives.length > 0 && (
          <Card className="alternatives-card">
            <h4>
              {difference >= 0 ? '🎉 Możesz również rozważyć:' : '💡 Alternatywne opcje w Twoim budżecie:'}
            </h4>
            <div className="alternatives-list">
              {alternatives.map(alt => (
                <div
                  key={alt.id}
                  className="alternative-option"
                  onClick={() => setSelectedLifestyle(alt.id)}
                >
                  <div className="alt-icon" style={{ color: alt.color }}>
                    {alt.icon}
                  </div>
                  <div className="alt-info">
                    <strong>{alt.name}</strong>
                    <span>{alt.monthlyCost.toLocaleString('pl-PL')} zł/mies.</span>
                  </div>
                  <Button type="link" size="small">
                    Zobacz →
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Card className="planning-tips">
        <h4>💰 Wskazówki planowania emerytury</h4>
        <ul>
          <li>
            <strong>Dodatkowe oszczędności emerytalne:</strong> Rozważ IKE (Indywidualne Konto Emerytalne) 
            lub IKZE (Indywidualne Konto Zabezpieczenia Emerytalnego) z korzyściami podatkowymi.
          </li>
          <li>
            <strong>Własność nieruchomości:</strong> Spłacone mieszkanie znacząco redukuje koszty życia na emeryturze.
          </li>
          <li>
            <strong>Inwestycje długoterminowe:</strong> Nawet niewielkie, regularne inwestycje przez dziesiątki lat 
            mogą znacząco zwiększyć Twój kapitał emerytalny.
          </li>
          <li>
            <strong>Zdrowie to oszczędności:</strong> Dbanie o zdrowie teraz zmniejsza koszty medyczne w przyszłości.
          </li>
        </ul>
      </Card>
    </Card>
  );
};

export default LifestyleComparison;
