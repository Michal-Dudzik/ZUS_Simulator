import React from 'react';
import { useTheme } from '../../common/hooks/useTheme';
import MainSimulator from '../simulator/components/MainSimulator';
import '../../styles/App.css'

const HomePage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`home-page-container ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <div className="home-page-content">
        {/* TODO: section with welcome message*/}
        <MainSimulator />
      {/* TODO: visible adter calculation is done stats, in separate widgets*/}
      {/* TODO: table with calculations*/}
      {/* TODO: section with ciekawostki*/}
      {/* TODO: section with usefull articles*/}
      </div>
    </div>
  );
};

export default HomePage; 