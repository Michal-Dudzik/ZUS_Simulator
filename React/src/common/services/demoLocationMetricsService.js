/**
 * Demo Location Metrics Service
 * Provides showcase data for location-based metrics in presentation mode
 */

import { generateShowcaseData } from './demoDataService';
import { getLocationMetrics as getRealLocationMetrics } from './analyticsService';

/**
 * Generate demo location metrics based on showcase data
 */
export const getLocationMetrics = () => {
  // Generate showcase data with postal codes
  const showcaseData = generateShowcaseData();
  
  // Store temporarily in localStorage to use the real analytics function
  const TEMP_KEY = 'temp_showcase_analytics';
  const originalData = localStorage.getItem('zus_simulator_analytics');
  
  try {
    // Temporarily replace analytics data with showcase data
    localStorage.setItem(TEMP_KEY, JSON.stringify(showcaseData));
    localStorage.setItem('zus_simulator_analytics', JSON.stringify(showcaseData));
    
    // Use the real function to calculate metrics
    const metrics = getRealLocationMetrics();
    
    // Restore original data
    if (originalData) {
      localStorage.setItem('zus_simulator_analytics', originalData);
    }
    localStorage.removeItem(TEMP_KEY);
    
    return metrics;
  } catch (error) {
    // Restore original data in case of error
    if (originalData) {
      localStorage.setItem('zus_simulator_analytics', originalData);
    }
    localStorage.removeItem(TEMP_KEY);
    
    console.error('Failed to generate demo location metrics:', error);
    return {
      byVoivodeship: {},
      totalWithLocation: 0,
      totalWithoutLocation: 0
    };
  }
};
