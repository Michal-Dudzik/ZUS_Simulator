import React from 'react';
import { useTheme } from '../../common/hooks/useTheme';
import SimulatorWelcome from '../simulator/components/SimulatorWelcome.jsx';
import SectionHeader from './components/SectionHeader';
import CuriositiesCard from '../curiosityCard/components/CuriositiesCard';
import FAQ from '../faq/components/FAQ';
import NewsSection from '../newsSection/NewsSection';
import '../../styles/App.css'

const HomePage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`home-page-container ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <div className="home-page-content">
        <SectionHeader
          title="Symulator emerytalny"
          date={{
            day: "5",
            month: "października",
            year: "2025"
          }}
        />
        
        <section id="simulator">
          <SimulatorWelcome />
        </section>
        
        <section id="curiosities">
          <CuriositiesCard />
        </section>

        <section id="news">
          <NewsSection />
        </section>
        
        <section id="faq">
          <FAQ />
        </section>
  
      </div>
    </div>
  );
};

export default HomePage; 