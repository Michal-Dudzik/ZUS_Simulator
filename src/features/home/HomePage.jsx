import React from 'react';
import { useTheme } from '../../common/hooks/useTheme';
import MainSimulator from '../simulator/components/MainSimulator';
import '../../styles/App.css'

const HomePage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`home-page-container ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <div className="home-page-content">
        <MainSimulator />
      </div>
    </div>
  );
};

export default HomePage; 