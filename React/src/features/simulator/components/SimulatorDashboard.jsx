import React, { useState } from 'react';
import { Button, Card } from 'antd';
import { PlayCircleOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useTheme } from '../../../common/hooks/useTheme';
import QuickSimulator from './QuickSimulator';
import DetailedSimulator from './DetailedSimulator';
import PensionVisualization from './PensionVisualization';
import './SimulatorDashboard.css';

const SimulatorDashboard = () => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [simulationType, setSimulationType] = useState(null); // 'quick' or 'detailed'
  const [showPensionIntro, setShowPensionIntro] = useState(true);

  const handleQuickSimulation = () => {
    console.log('Quick simulation clicked');
    setSimulationType('quick');
    setShowPensionIntro(false);
    setIsExpanded(true);
    // TODO: Implement quick simulation logic
  };

  const handleDetailedSimulation = () => {
    console.log('Detailed simulation clicked');
    setSimulationType('detailed');
    setShowPensionIntro(false);
    setIsExpanded(true);
    // TODO: Implement detailed simulation logic
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setSimulationType(null); // Reset simulation type when collapsing
    setShowPensionIntro(true); // Reset pension intro when collapsing
  };


  return (
    <div className="main-simulator-container">
      <Card 
        className={`main-simulator-card ${isExpanded ? 'expanded' : 'collapsed'} ${isDark ? 'theme-dark' : 'theme-light'}`}
      >
        {!isExpanded && (
          <div className="simulator-header">
            <div className="simulator-title-section">
              <h2 className="simulator-title">Symulator ZUS</h2>
              <p className="simulator-description">
                Sprawdź, jaką emeryturę możesz otrzymać w przyszłości
              </p>
            </div>
            
            <div className="simulator-actions">
              <Button 
                type="primary" 
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleQuickSimulation}
                className="simulator-button quick-button"
              >
                Szybka symulacja
              </Button>
              <Button 
                size="large"
                icon={<SettingOutlined />}
                onClick={handleDetailedSimulation}
                className="simulator-button detailed-button"
              >
                Szczegółowa symulacja
              </Button>
              <Button 
                size="large"
                icon={<InfoCircleOutlined />}
                onClick={() => setShowPensionIntro(true)}
                className="simulator-button info-button"
              >
                Informacje o emeryturach
              </Button>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="simulator-expanded-content">
            <div className="expanded-header">
              <h3>
                {showPensionIntro && 'Jaką chciałbyś/chciałabyś mieć emeryturę w przyszłości?'}
                {simulationType === 'quick' && 'Szybka symulacja'}
                {simulationType === 'detailed' && 'Szczegółowa symulacja'}
                {!simulationType && !showPensionIntro && 'Opcje symulacji'}
              </h3>
              <Button 
                type="text" 
                onClick={toggleExpanded}
                className="collapse-button"
              >
                Zwiń
              </Button>
            </div>
            
            {showPensionIntro && (
              <div className="pension-intro-content">
                <PensionVisualization />
                <div className="pension-intro-actions">
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={handleQuickSimulation}
                    className="intro-action-button"
                  >
                    Rozpocznij symulację
                  </Button>
                  <Button 
                    size="large"
                    icon={<SettingOutlined />}
                    onClick={handleDetailedSimulation}
                    className="intro-action-button"
                  >
                    Szczegółowa symulacja
                  </Button>
                </div>
              </div>
            )}
            
            {!simulationType && !showPensionIntro && (
              <div className="simulation-options">
                <div className="option-card">
                  <h4>Szybka symulacja</h4>
                  <p>Otrzymaj natychmiastowe wyniki z podstawowymi informacjami</p>
                  <Button 
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    onClick={handleQuickSimulation}
                    className="option-button"
                  >
                    Rozpocznij szybką symulację
                  </Button>
                </div>
                
                <div className="option-card">
                  <h4>Szczegółowa symulacja</h4>
                  <p>Kompleksowa analiza z zaawansowanymi opcjami</p>
                  <Button 
                    icon={<SettingOutlined />}
                    onClick={handleDetailedSimulation}
                    className="option-button"
                  >
                    Rozpocznij szczegółową symulację
                  </Button>
                </div>
              </div>
            )}

            {simulationType === 'quick' && <QuickSimulator />}
            {simulationType === 'detailed' && <DetailedSimulator />}

            {!simulationType && !showPensionIntro && (
              <div className="placeholder-content">
                <h4>Dodatkowe funkcje (Wkrótce)</h4>
                <div className="placeholder-grid">
                  <div className="placeholder-item">
                    <h5>Kalkulator składek</h5>
                    <p>Oblicz miesięczne składki na podstawie dochodu</p>
                  </div>
                  <div className="placeholder-item">
                    <h5>Estymator świadczeń</h5>
                    <p>Oszacuj przyszłe świadczenia emerytalne</p>
                  </div>
                  <div className="placeholder-item">
                    <h5>Porównanie scenariuszy</h5>
                    <p>Porównaj różne scenariusze składek</p>
                  </div>
                  <div className="placeholder-item">
                    <h5>Analiza historyczna</h5>
                    <p>Przeanalizuj wzorce składek z przeszłości</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SimulatorDashboard;
