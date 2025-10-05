import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Spin, Empty, Statistic, Tag, Tooltip, Space, Button } from 'antd';
import { EnvironmentOutlined, ExperimentOutlined, BugOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageLayout from '../components/PageLayout';
import { getLocationMetrics } from '../../../common/services/analyticsService';
import { getLocationMetrics as getDemoLocationMetrics } from '../../../common/services/demoLocationMetricsService';
import polandMapSvg from '../../../assets/Wojewodztwa.svg';

const { Title: AntTitle, Text } = Typography;

const PRESENTATION_MODE_KEY = 'admin_presentation_mode';
const DEBUG_MODE_KEY = 'location_map_debug_mode';

// Voivodeship colors for the map
const VOIVODESHIP_COLORS = {
  'mazowieckie': '#1890ff',
  'wielkopolskie': '#52c41a',
  'małopolskie': '#faad14',
  'śląskie': '#722ed1',
  'dolnośląskie': '#eb2f96',
  'pomorskie': '#13c2c2',
  'zachodniopomorskie': '#2f54eb',
  'łódzkie': '#fa8c16',
  'lubelskie': '#a0d911',
  'podkarpackie': '#f5222d',
  'kujawsko-pomorskie': '#52c41a',
  'opolskie': '#faad14',
  'lubuskie': '#722ed1',
  'warmińsko-mazurskie': '#13c2c2',
  'podlaskie': '#eb2f96',
  'świętokrzyskie': '#1890ff'
};

// Map path IDs from the SVG to voivodeships
// NOTE: To map regions correctly, enable Debug Mode, click on each region to see its path ID,
// then update this mapping. The new SVG (Wojewodztwa.svg) has labeled regions.
const PATH_TO_VOIVODESHIP = {
  'path10': 'pomorskie',    // To be verified
  'path12': 'zachodniopomorskie',          // To be verified
  'path14': 'podlaskie',              // To be verified          // Small region - to be verified
  'path16-0-6': 'warmińsko-mazurskie',        // To be verified
  'path68-9-7': 'kujawsko-pomorskie',            // To be verified
  'path186-1-9-2-7': 'mazowieckie',  // To be verified
  'path152-1-7-3': 'wielkopolskie',       // To be verified
  'path190-6-2': 'lubelskie',
  
};

const LocationMetricsPage = () => {
  const { t } = useTranslation();
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVoivodeship, setSelectedVoivodeship] = useState(null);
  const [isPresentationMode, setIsPresentationMode] = useState(() => {
    return localStorage.getItem(PRESENTATION_MODE_KEY) === 'true';
  });
  const [debugMode, setDebugMode] = useState(() => {
    return localStorage.getItem(DEBUG_MODE_KEY) === 'true';
  });

  const loadData = () => {
    setLoading(true);
    try {
      const presentationMode = localStorage.getItem(PRESENTATION_MODE_KEY) === 'true';
      
      if (presentationMode) {
        const demoMetrics = getDemoLocationMetrics();
        setLocationData(demoMetrics);
      } else {
        const metrics = getLocationMetrics();
        setLocationData(metrics);
      }
    } catch (error) {
      console.error('Failed to load location metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    const handlePresentationModeChange = (event) => {
      setIsPresentationMode(event.detail.enabled);
      loadData();
    };
    
    window.addEventListener('presentationModeChange', handlePresentationModeChange);
    return () => {
      window.removeEventListener('presentationModeChange', handlePresentationModeChange);
    };
  }, []);

  useEffect(() => {
    // Load and process the SVG
    const loadSvg = async () => {
      try {
        const response = await fetch(polandMapSvg);
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (svgElement) {
          const mapContainer = document.getElementById('poland-map-container');
          if (mapContainer) {
            mapContainer.innerHTML = '';
            
            // Get original dimensions to set viewBox
            const originalWidth = svgElement.getAttribute('width') || svgElement.viewBox.baseVal.width || 2061;
            const originalHeight = svgElement.getAttribute('height') || svgElement.viewBox.baseVal.height || 1925;
            
            // Remove fixed dimensions and set viewBox for proper scaling
            svgElement.removeAttribute('width');
            svgElement.removeAttribute('height');
            
            // Ensure viewBox is set correctly
            if (!svgElement.getAttribute('viewBox')) {
              svgElement.setAttribute('viewBox', `0 0 ${originalWidth} ${originalHeight}`);
            }
            
            // Style the SVG element - center it properly and ensure it fits
            svgElement.style.width = '100%';
            svgElement.style.height = '100%';
            svgElement.style.maxHeight = '500px';
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            
            svgElement.removeAttribute('sodipodi:docname');
            svgElement.removeAttribute('sodipodi:docbase');
            
            mapContainer.appendChild(svgElement);
            
            // Get all paths in the SVG
            const paths = svgElement.querySelectorAll('path');
            console.log(`Found ${paths.length} paths in SVG`);
            
            let processedPaths = 0;
            
            // Add event listeners and styling to all paths
            paths.forEach((path) => {
              const pathId = path.getAttribute('id');
              const voivodeship = PATH_TO_VOIVODESHIP[pathId];
              
              // Check if path has a fill (either as attribute or in style)
              const fillAttr = path.getAttribute('fill');
              const styleAttr = path.getAttribute('style');
              const hasFill = (fillAttr && fillAttr !== 'none') || (styleAttr && styleAttr.includes('fill:'));
              
              // Skip paths without fill (likely text paths)
              if (!hasFill) {
                console.log('Skipping path without fill:', pathId);
                return;
              }
              
              processedPaths++;
              console.log('Processing path:', pathId, 'Voivodeship:', voivodeship || 'UNMAPPED');
              
              // Apply base styling
              path.style.cursor = 'pointer';
              path.style.transition = 'all 0.3s ease';
              path.style.stroke = '#333';
              path.style.strokeWidth = '1.5';
              path.style.pointerEvents = 'all'; // Ensure path receives events
              
              if (voivodeship) {
                const data = locationData?.byVoivodeship[voivodeship];
                if (data) {
                  const maxCount = Math.max(...Object.values(locationData.byVoivodeship).map(v => v.count));
                  const intensity = data.count / maxCount;
                  const baseColor = VOIVODESHIP_COLORS[voivodeship] || '#1890ff';
                  const opacity = 0.4 + (intensity * 0.6);
                  
                  path.style.fill = baseColor;
                  path.style.fillOpacity = opacity.toString();
                } else {
                  path.style.fill = '#d9d9d9';
                  path.style.fillOpacity = '0.5';
                }
                
                // Add click handler
                const clickHandler = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Clicked path ID:', pathId, 'Mapped to:', voivodeship);
                  
                  if (debugMode) {
                    alert(`Path ID: ${pathId}\nMapped to: ${voivodeship}`);
                  }
                  setSelectedVoivodeship(prev => prev === voivodeship ? null : voivodeship);
                };
                
                path.addEventListener('click', clickHandler);
                path.onclick = clickHandler; // Fallback
                
                // Add hover effect for visual feedback only
                path.addEventListener('mouseenter', () => {
                  path.style.strokeWidth = '3';
                  path.style.filter = 'brightness(1.15)';
                });
                
                path.addEventListener('mouseleave', () => {
                  path.style.strokeWidth = '1.5';
                  path.style.filter = 'none';
                });
              } else {
                // Paths not mapped to voivodeships - always make clickable in debug mode
                const clickHandler = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Unmapped path ID:', pathId);
                  alert(`Unmapped Path ID: ${pathId}\n\nAdd this to PATH_TO_VOIVODESHIP mapping.`);
                };
                
                path.addEventListener('click', clickHandler);
                path.onclick = clickHandler; // Fallback
                
                if (!debugMode) {
                  path.style.opacity = '0.3';
                }
              }
            });
            
            console.log(`Processed ${processedPaths} paths with fill colors`);
          }
        }
      } catch (error) {
        console.error('Failed to load SVG map:', error);
      }
    };
    
    if (locationData && !loading) {
      loadSvg();
    }
  }, [locationData, loading, debugMode, selectedVoivodeship]);

  if (loading) {
    return (
      <PageLayout icon={EnvironmentOutlined} title={t('admin.locationMetrics.title')}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </PageLayout>
    );
  }

  if (!locationData || Object.keys(locationData.byVoivodeship).length === 0) {
    return (
      <PageLayout icon={EnvironmentOutlined} title={t('admin.locationMetrics.title')}>
        <Empty
          description={t('admin.locationMetrics.noData') || 'No location data available yet'}
          style={{ padding: '50px' }}
        >
          <Text type="secondary">
            {t('admin.locationMetrics.noDataDescription') || 'Users need to provide postal codes in the simulator'}
          </Text>
        </Empty>
      </PageLayout>
    );
  }

  // Get top voivodeships by usage
  const sortedVoivodeships = Object.entries(locationData.byVoivodeship)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  return (
    <PageLayout 
      icon={EnvironmentOutlined}
      title={t('admin.locationMetrics.title')}
      cardClassName="location-metrics-page-card"
    >
      {/* Presentation Mode Indicator & Debug Mode Toggle */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {isPresentationMode && (
            <Tag icon={<ExperimentOutlined />} color="orange" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {t('admin.presentationModeActive') || 'Presentation Mode - Demo Data'}
            </Tag>
          )}
        </div>
        <Button
          icon={<BugOutlined />}
          onClick={() => {
            const newMode = !debugMode;
            setDebugMode(newMode);
            localStorage.setItem(DEBUG_MODE_KEY, newMode.toString());
          }}
          type={debugMode ? 'primary' : 'default'}
          size="small"
        >
          {debugMode ? 'Debug Mode ON' : 'Debug Mode'}
        </Button>
      </div>

      {/* Overview Stats */}
      <div style={{ marginBottom: 32 }}>
        <AntTitle level={4} style={{ marginBottom: 16 }}>
          {t('admin.locationMetrics.overview') || 'Overview'}
        </AntTitle>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic
                title={t('admin.locationMetrics.totalWithLocation') || 'Simulations with Location'}
                value={locationData.totalWithLocation}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic
                title={t('admin.locationMetrics.totalWithoutLocation') || 'Without Location'}
                value={locationData.totalWithoutLocation}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic
                title={t('admin.locationMetrics.coverageRate') || 'Location Coverage'}
                value={((locationData.totalWithLocation / (locationData.totalWithLocation + locationData.totalWithoutLocation)) * 100).toFixed(1)}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Map and Details */}
      <div style={{ marginBottom: 32 }}>
        <AntTitle level={4} style={{ marginBottom: 16 }}>
          {t('admin.locationMetrics.mapTitle') || 'Distribution by Voivodeship'}
        </AntTitle>
        <Row gutter={[24, 24]}>
          {/* Map */}
          <Col xs={24} lg={14}>
            <Card>
              <div 
                id="poland-map-container" 
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '500px',
                  maxHeight: '600px',
                  padding: '10px',
                  overflow: 'hidden'
                }}
                onClick={() => setSelectedVoivodeship(null)}
              >
                <Spin />
              </div>
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Text type="secondary">
                  {t('admin.locationMetrics.clickInstruction') || 'Click on regions to see statistics'}
                </Text>
                {debugMode && (
                  <div style={{ marginTop: 8 }}>
                    <Text type="warning" strong>
                      Debug Mode: Click any region to see its path ID
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* Details Panel */}
          <Col xs={24} lg={10}>
            <Card title={selectedVoivodeship ? t(`admin.locationMetrics.voivodeship.${selectedVoivodeship}`) : t('admin.locationMetrics.selectRegion') || 'Select a region'}>
              {selectedVoivodeship && locationData.byVoivodeship[selectedVoivodeship] ? (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Statistic
                    title={t('admin.locationMetrics.totalSimulations') || 'Total Simulations'}
                    value={locationData.byVoivodeship[selectedVoivodeship].count}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Statistic
                    title={t('admin.locationMetrics.avgIncome') || 'Average Monthly Income'}
                    value={locationData.byVoivodeship[selectedVoivodeship].avgIncome.toFixed(0)}
                    suffix="PLN"
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <Statistic
                    title={t('admin.locationMetrics.avgPension') || 'Average Projected Pension'}
                    value={locationData.byVoivodeship[selectedVoivodeship].avgPension.toFixed(0)}
                    suffix="PLN"
                    valueStyle={{ color: '#722ed1' }}
                  />
                  <Statistic
                    title={t('admin.locationMetrics.avgAge') || 'Average Age'}
                    value={locationData.byVoivodeship[selectedVoivodeship].avgAge.toFixed(1)}
                    suffix={t('admin.dashboard.years') || 'years'}
                    valueStyle={{ color: '#faad14' }}
                  />
                  <div>
                    <Text strong>{t('admin.locationMetrics.genderSplit') || 'Gender Distribution'}:</Text>
                    <div style={{ marginTop: 8 }}>
                      <Tag color="blue">
                        {t('simulator.form.gender.male') || 'Male'}: {locationData.byVoivodeship[selectedVoivodeship].genderCount.male || 0}
                      </Tag>
                      <Tag color="pink">
                        {t('simulator.form.gender.female') || 'Female'}: {locationData.byVoivodeship[selectedVoivodeship].genderCount.female || 0}
                      </Tag>
                    </div>
                  </div>
                </Space>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t('admin.locationMetrics.clickRegion') || 'Click on a region on the map to see details'}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {/* Top Voivodeships */}
      <div>
        <AntTitle level={4} style={{ marginBottom: 16 }}>
          {t('admin.locationMetrics.topRegions') || 'Top 5 Regions by Usage'}
        </AntTitle>
        <Row gutter={[16, 16]}>
          {sortedVoivodeships.map(([voivodeship, data], index) => (
            <Col xs={24} sm={12} md={8} key={voivodeship}>
              <Card>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>
                    #{index + 1} {t(`admin.locationMetrics.voivodeship.${voivodeship}`) || voivodeship}
                  </Text>
                  <Statistic
                    title={t('admin.locationMetrics.simulations') || 'Simulations'}
                    value={data.count}
                    valueStyle={{ fontSize: '20px' }}
                  />
                  <div>
                    <Text type="secondary">
                      {t('admin.locationMetrics.avgIncome') || 'Avg Income'}: {data.avgIncome.toFixed(0)} PLN
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </PageLayout>
  );
};

export default LocationMetricsPage;
