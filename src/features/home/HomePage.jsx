import React from 'react';
import { useTheme } from '../../common/hooks/useTheme';
import '../../styles/App.css'

const HomePage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`content-wrapper home-page-wrapper ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <div className="welcome-container">
        <h1 className="welcome-title">Welcome to React Template</h1>
        <p className="welcome-description">
          This is a clean React template with modern tooling and architecture patterns.
          It includes routing, internationalization, theming, and an admin panel structure.
        </p>
        <div className="features-list">
          <h2>Features Included:</h2>
          <ul>
            <li>React 18 with Vite</li>
            <li>React Router with lazy loading</li>
            <li>Internationalization (i18next)</li>
            <li>Theme system with dark/light mode</li>
            <li>Admin panel structure</li>
            <li>Ant Design components</li>
            <li>ESLint configuration</li>
            <li>Responsive design</li>
          </ul>
        </div>
        <div className="getting-started">
          <h2>Getting Started:</h2>
          <p>
            Customize this template by modifying the components, adding your own features,
            and updating the translations to match your project needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 