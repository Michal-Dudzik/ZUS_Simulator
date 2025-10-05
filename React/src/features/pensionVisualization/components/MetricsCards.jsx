import React from 'react';
import { Card, Row, Col } from 'antd';
import { formatCurrency } from '../../simulator/data/pensionData';
import './MetricsCards.css';

const MetricsCards = ({ 
  projectedPension, 
  totalCapitalAccumulated, 
  retirementAge, 
  yearsOfWork,
  monthlyIncome 
}) => {
  const replacementRate = ((projectedPension / monthlyIncome) * 100).toFixed(0);

  return (
    <Row gutter={[16, 16]} className="metrics-row">
      <Col xs={24} sm={12}>
        <Card className="metric-card pension-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-label">Przewidywana emerytura</div>
            <div className="metric-value">{formatCurrency(projectedPension)}</div>
            <div className="metric-subtitle">miesięcznie (brutto)</div>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12}>
        <Card className="metric-card capital-card">
          <div className="metric-icon">🏦</div>
          <div className="metric-content">
            <div className="metric-label">Zgromadzony kapitał</div>
            <div className="metric-value">{formatCurrency(totalCapitalAccumulated)}</div>
            <div className="metric-subtitle">do wieku {retirementAge} lat</div>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12}>
        <Card className="metric-card years-card">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <div className="metric-label">Lata pracy</div>
            <div className="metric-value">{yearsOfWork.toFixed(1)}</div>
            <div className="metric-subtitle">lat składkowych</div>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12}>
        <Card className="metric-card rate-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-label">Stopa zastąpienia</div>
            <div className="metric-value">{replacementRate}%</div>
            <div className="metric-subtitle">emerytury vs wynagrodzenie</div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default MetricsCards;
