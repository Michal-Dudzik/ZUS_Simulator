import React from 'react';
import { Card, Row, Col } from 'antd';
import { formatCurrency } from '../../simulator/data/pensionData';
import './StatisticsSection.css';

const StatisticsSection = ({ 
  annualZusContributions, 
  yearsOfWork,
  totalCapitalAccumulated,
  projectedPension 
}) => {
  const totalContributions = annualZusContributions * yearsOfWork;
  const roi = ((totalCapitalAccumulated / totalContributions - 1) * 100).toFixed(1);
  const totalPayout = projectedPension * 12 * 18;

  return (
    <Card className="statistics-card">
      <h3>Dodatkowe Statystyki</h3>
      <Row gutter={[16, 16]} className="statistics-row">
        <Col xs={24} sm={12} md={8}>
          <div className="stat-item">
            <div className="stat-label">Całkowite wpłaty do ZUS:</div>
            <div className="stat-value">
              {formatCurrency(totalContributions)}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className="stat-item">
            <div className="stat-label">Zwrot z inwestycji (ROI):</div>
            <div className="stat-value">
              {roi}%
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className="stat-item">
            <div className="stat-label">Całkowita wypłata emerytury:</div>
            <div className="stat-value">
              {formatCurrency(totalPayout)}
            </div>
            <div className="stat-subtitle">(przez 18 lat)</div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default StatisticsSection;
