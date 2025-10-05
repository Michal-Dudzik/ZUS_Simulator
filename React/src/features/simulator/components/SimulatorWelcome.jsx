import React, { useState } from 'react';
import { Button, Card } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useTheme } from '../../../common/hooks/useTheme';
import Simulator from './Simulator.jsx';
import image1 from '../../../assets/image1.png';
import image2 from '../../../assets/image2.png';
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
              Sprawdź jak może wyglądać Twoja przyszłość!
              </p>
              
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
            
            <div className="floating-images-container">
              <img src={image1} alt="Visualization preview 1" className="floating-image floating-image-1" />
              <img src={image2} alt="Visualization preview 2" className="floating-image floating-image-2" />
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
