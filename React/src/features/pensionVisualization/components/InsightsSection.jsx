import React from 'react';
import { Card, Row, Col } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formatCurrency, pensionData } from '../../simulator/data/pensionData';
import './InsightsSection.css';

const InsightsSection = ({ 
  projectedPension, 
  calculateScenario 
}) => {
  const oneYearIncrease = calculateScenario(1, 0).pension - projectedPension;

  return (
    <Card className="insights-card">
      <h3>
        <InfoCircleOutlined /> Kluczowe Wnioski i Porady
      </h3>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <div className="insight-item">
            <div className="insight-icon positive">✅</div>
            <div className="insight-content">
              <h4>Twoja pozycja</h4>
              <p>
                {projectedPension > pensionData.currentAverage ? (
                  <>Twoja przewidywana emerytura jest o <strong>{formatCurrency(projectedPension - pensionData.currentAverage)}</strong> wyższa od średniej krajowej.</>
                ) : (
                  <>Twoja przewidywana emerytura jest poniżej średniej krajowej o <strong>{formatCurrency(pensionData.currentAverage - projectedPension)}</strong>.</>
                )}
              </p>
            </div>
          </div>
        </Col>
        
        <Col xs={24} md={12}>
          <div className="insight-item">
            <div className="insight-icon info">💡</div>
            <div className="insight-content">
              <h4>Wpływ dodatkowego roku pracy</h4>
              <p>
                Każdy dodatkowy rok pracy może zwiększyć Twoją emeryturę o około{' '}
                <strong>{formatCurrency(oneYearIncrease)}</strong> miesięcznie.
              </p>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="insight-item">
            <div className="insight-icon warning">⚠️</div>
            <div className="insight-content">
              <h4>Uwaga na inflację</h4>
              <p>
                Pamiętaj, że podane kwoty są nominalne. Realną siłę nabywczą emerytury w przyszłości zmniejszy inflacja (średnio 2-3% rocznie).
              </p>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="insight-item">
            <div className="insight-icon tip">🎯</div>
            <div className="insight-content">
              <h4>Dodatkowe oszczędności</h4>
              <p>
                Rozważ otwarcie III filaru emerytalnego (IKE/IKZE) lub prywatne oszczędności, aby uzupełnić emeryturę z ZUS.
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default InsightsSection;
