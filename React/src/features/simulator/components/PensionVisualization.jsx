import React, { useState } from 'react';
import { Card, Tooltip } from 'antd';
import { pensionData, formatCurrency } from '../data/pensionData';
import './PensionVisualization.css';

const PensionVisualization = () => {
  const [hoveredGroup, setHoveredGroup] = useState(null);

  const handleGroupHover = (group) => {
    setHoveredGroup(group);
  };

  const handleGroupLeave = () => {
    setHoveredGroup(null);
  };

  return (
    <div className="pension-visualization">
      <div className="pension-stats">
        <div className="current-average">
          <h3>Obecna średnia emerytura w Polsce</h3>
          <div className="average-amount">
            {formatCurrency(pensionData.currentAverage)}
          </div>
        </div>
      </div>

      <div className="pension-groups">
        <h4>Rozkład emerytur według grup</h4>
        <div className="groups-container">
          {pensionData.pensionGroups.map((group) => (
            <Tooltip
              key={group.id}
              title={
                <div className="group-tooltip">
                  <div className="tooltip-title">
                    {group.id === 'belowMinimum' && 'Poniżej minimum'}
                    {group.id === 'aroundAverage' && 'Wokół średniej'}
                    {group.id === 'aboveAverage' && 'Powyżej średniej'}
                  </div>
                  <div className="tooltip-range">
                    {group.id === 'belowMinimum' && '0 - 1 200 zł'}
                    {group.id === 'aroundAverage' && '1 200 - 3 000 zł'}
                    {group.id === 'aboveAverage' && '3 000+ zł'}
                  </div>
                  <div className="tooltip-description">
                    {group.id === 'belowMinimum' && 'Pracowałeś/aś poniżej 25/20 lat, brak prawa do gwarantowanego minimum'}
                    {group.id === 'aroundAverage' && 'Standardowa emerytura dla większości Polaków'}
                    {group.id === 'aboveAverage' && 'Wyższa emerytura dzięki dodatkowym składkom i oszczędnościom'}
                  </div>
                  <div className="tooltip-percentage">
                    {group.percentage}% emerytów
                  </div>
                </div>
              }
              placement="top"
            >
              <Card
                className={`group-card ${hoveredGroup?.id === group.id ? 'hovered' : ''}`}
                style={{ 
                  borderColor: group.color,
                  backgroundColor: hoveredGroup?.id === group.id ? `${group.color}15` : 'transparent'
                }}
                onMouseEnter={() => handleGroupHover(group)}
                onMouseLeave={handleGroupLeave}
              >
                <div className="group-header">
                  <div 
                    className="group-color-indicator" 
                    style={{ backgroundColor: group.color }}
                  />
                  <h5>
                    {group.id === 'belowMinimum' && 'Poniżej minimum'}
                    {group.id === 'aroundAverage' && 'Wokół średniej'}
                    {group.id === 'aboveAverage' && 'Powyżej średniej'}
                  </h5>
                </div>
                <div className="group-range">
                  {group.id === 'belowMinimum' && '0 - 1 200 zł'}
                  {group.id === 'aroundAverage' && '1 200 - 3 000 zł'}
                  {group.id === 'aboveAverage' && '3 000+ zł'}
                </div>
                <div className="group-percentage">
                  {group.percentage}%
                </div>
                <div className="group-bar">
                  <div 
                    className="group-bar-fill"
                    style={{ 
                      width: `${group.percentage}%`,
                      backgroundColor: group.color
                    }}
                  />
                </div>
              </Card>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="pension-insights">
        <div className="insight-card">
          <h5>Dodatkowe informacje</h5>
          <div className="insight-stats">
            <div className="insight-item">
              <span className="insight-label">Łączna liczba emerytów:</span>
              <span className="insight-value">
                {pensionData.statistics.totalPensioners.toLocaleString('pl-PL')}
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Średni wiek emerytalny:</span>
              <span className="insight-value">{pensionData.statistics.averageAge} lat</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Oczekiwana długość życia:</span>
              <span className="insight-value">{pensionData.statistics.lifeExpectancy} lat</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Wskaźnik zastąpienia:</span>
              <span className="insight-value">
                {(pensionData.statistics.replacementRate * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PensionVisualization;
