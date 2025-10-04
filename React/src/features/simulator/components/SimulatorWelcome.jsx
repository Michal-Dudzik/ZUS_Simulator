import React, { useState } from 'react';
import { Button, Card } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useTheme } from '../../../common/hooks/useTheme';
import Simulator from './Simulator.jsx';
import './SimulatorDashboard.css';

const SimulatorWelcome = () => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStartSimulation = () => {
    console.log('Start simulation clicked');
    setIsExpanded(true);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
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
                onClick={handleStartSimulation}
                className="simulator-button start-button"
              >
                Rozpocznij symulację
              </Button>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="simulator-expanded-content">
            <div className="expanded-header">
              <h3>Symulacja emerytury</h3>
              <Button 
                type="text" 
                onClick={toggleExpanded}
                className="collapse-button"
              >
                Zwiń
              </Button>
            </div>
            
            <Simulator />
          </div>
        )}
      </Card>
    </div>
  );
};

export default SimulatorWelcome;
