import React from 'react';
import { useLanguage } from '../../../i18n/useLanguage';
import './SectionNavigation.css';

const SectionNavigation = () => {
  const { t } = useLanguage();

  const sections = [
    { id: 'simulator', label: t('navigation.sections.simulator') },
    { id: 'curiosities', label: t('navigation.sections.curiosities') },
    { id: 'news', label: t('navigation.sections.news') },
    { id: 'faq', label: t('navigation.sections.faq') }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Offset for fixed headers
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="section-navigation">
      <div className="section-navigation-container">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="section-nav-item"
            aria-label={`Scroll to ${section.label}`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default SectionNavigation;
