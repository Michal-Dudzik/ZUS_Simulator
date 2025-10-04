import React, { useState, useEffect, useRef } from 'react';
import { Button, Card } from 'antd';
import { PlayCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { useTheme } from '../../../common/hooks/useTheme';
import QuickSimulator from './QuickSimulator';
import DetailedSimulator from './DetailedSimulator';
import './MainSimulator.css';

const MainSimulator = () => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [simulationType, setSimulationType] = useState(null); // 'quick' or 'detailed'
  const [isScrollHijacked, setIsScrollHijacked] = useState(false);
  const containerRef = useRef(null);
  const expandedContentRef = useRef(null);

  // Scroll hijacking logic
  useEffect(() => {
    if (!isExpanded || !containerRef.current || !expandedContentRef.current) {
      return;
    }

    const handleScroll = (e) => {
      const container = containerRef.current;
      const expandedContent = expandedContentRef.current;
      
      if (!container || !expandedContent) return;

      const containerRect = container.getBoundingClientRect();
      const expandedRect = expandedContent.getBoundingClientRect();
      
      // Check if the expanded content is fully visible
      const isFullyVisible = containerRect.top <= 0 && containerRect.bottom >= window.innerHeight;
      
      if (isFullyVisible && !isScrollHijacked) {
        // Start hijacking scroll
        setIsScrollHijacked(true);
        document.body.style.overflow = 'hidden';
      } else if (!isFullyVisible && isScrollHijacked) {
        // Stop hijacking scroll
        setIsScrollHijacked(false);
        document.body.style.overflow = 'unset';
      }

      if (isScrollHijacked) {
        // Check if we've scrolled to the bottom of the expanded content
        const isAtBottom = expandedContent.scrollTop + expandedContent.clientHeight >= expandedContent.scrollHeight;
        
        if (isAtBottom && e.deltaY > 0) {
          // Allow page to scroll when we reach the bottom and user scrolls down
          setIsScrollHijacked(false);
          document.body.style.overflow = 'unset';
        }
      }
    };

    const handleWheel = (e) => {
      if (isScrollHijacked && expandedContentRef.current) {
        e.preventDefault();
        expandedContentRef.current.scrollTop += e.deltaY;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded, isScrollHijacked]);

  const handleQuickSimulation = () => {
    console.log('Quick simulation clicked');
    setSimulationType('quick');
    setIsExpanded(true);
    // Scroll to the simulator component after a short delay to allow expansion
    setTimeout(() => {
      const simulatorElement = document.querySelector('.main-simulator-container');
      if (simulatorElement) {
        simulatorElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
    // TODO: Implement quick simulation logic
  };

  const handleDetailedSimulation = () => {
    console.log('Detailed simulation clicked');
    setSimulationType('detailed');
    setIsExpanded(true);
    // Scroll to the simulator component after a short delay to allow expansion
    setTimeout(() => {
      const simulatorElement = document.querySelector('.main-simulator-container');
      if (simulatorElement) {
        simulatorElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
    // TODO: Implement detailed simulation logic
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setSimulationType(null); // Reset simulation type when collapsing
    setIsScrollHijacked(false); // Reset scroll hijacking
    document.body.style.overflow = 'unset'; // Restore page scroll
    
    // If collapsing, scroll back to the top of the simulator
    if (isExpanded) {
      setTimeout(() => {
        const simulatorElement = document.querySelector('.main-simulator-container');
        if (simulatorElement) {
          simulatorElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  };


  return (
    <div className="main-simulator-container" ref={containerRef}>
      <Card 
        className={`main-simulator-card ${isExpanded ? 'expanded' : 'collapsed'} ${isDark ? 'theme-dark' : 'theme-light'}`}
      >
        <div className="simulator-header">
          <div className="simulator-title-section">
            <h2 className="simulator-title">ZUS Simulator</h2>
            <p className="simulator-description">
              Calculate your social security contributions and benefits with our comprehensive simulation tool.
              Choose between quick calculations or detailed analysis.
            </p>
          </div>
          
          {!isExpanded && (
            <div className="simulator-actions">
              <Button 
                type="primary" 
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleQuickSimulation}
                className="simulator-button quick-button"
              >
                Quick Simulation
              </Button>
              <Button 
                size="large"
                icon={<SettingOutlined />}
                onClick={handleDetailedSimulation}
                className="simulator-button detailed-button"
              >
                Detailed Simulation
              </Button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="simulator-expanded-content" ref={expandedContentRef}>
            <div className="expanded-header">
              <h3>
                {simulationType === 'quick' && 'Quick Simulation'}
                {simulationType === 'detailed' && 'Detailed Simulation'}
                {!simulationType && 'Simulation Options'}
              </h3>
              <Button 
                type="text" 
                onClick={toggleExpanded}
                className="collapse-button"
              >
                Collapse
              </Button>
            </div>
            
            {!simulationType && (
              <div className="simulation-options">
                <div className="option-card">
                  <h4>Quick Simulation</h4>
                  <p>Get instant results with basic information</p>
                  <Button 
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    onClick={handleQuickSimulation}
                    className="option-button"
                  >
                    Start Quick Simulation
                  </Button>
                </div>
                
                <div className="option-card">
                  <h4>Detailed Simulation</h4>
                  <p>Comprehensive analysis with advanced options</p>
                  <Button 
                    icon={<SettingOutlined />}
                    onClick={handleDetailedSimulation}
                    className="option-button"
                  >
                    Start Detailed Simulation
                  </Button>
                </div>
              </div>
            )}

            {simulationType === 'quick' && <QuickSimulator />}
            {simulationType === 'detailed' && <DetailedSimulator />}

            {!simulationType && (
              <div className="placeholder-content">
                <h4>Additional Features (Coming Soon)</h4>
                <div className="placeholder-grid">
                  <div className="placeholder-item">
                    <h5>Contribution Calculator</h5>
                    <p>Calculate monthly contributions based on income</p>
                  </div>
                  <div className="placeholder-item">
                    <h5>Benefit Estimator</h5>
                    <p>Estimate future retirement benefits</p>
                  </div>
                  <div className="placeholder-item">
                    <h5>Scenario Comparison</h5>
                    <p>Compare different contribution scenarios</p>
                  </div>
                  <div className="placeholder-item">
                    <h5>Historical Analysis</h5>
                    <p>Analyze past contribution patterns</p>
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

export default MainSimulator;
