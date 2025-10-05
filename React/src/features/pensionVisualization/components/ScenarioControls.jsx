import React from 'react';
import { Card, Slider, Row, Col } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../simulator/data/pensionData';
import './ScenarioControls.css';

const ScenarioControls = ({
  extraYears,
  extraSalary,
  onExtraYearsChange,
  onExtraSalaryChange,
  scenarioData,
  projectedPension,
  totalCapitalAccumulated,
  pensionIncrease,
  capitalIncrease
}) => {
  return (
    <Card className="scenario-controls-card">
      <h3>
        <ClockCircleOutlined /> Symuluj Scenariusze "Co Jeśli?"
      </h3>
      <p className="controls-description">
        Zobacz, jak zmieni się Twoja emerytura przy różnych założeniach
      </p>
      
      <Row gutter={[24, 24]} style={{ marginTop: '1.5rem' }}>
        <Col xs={24} md={12}>
          <div className="control-item">
            <div className="control-header">
              <label>Dodatkowe lata pracy:</label>
              <span className="control-value">{extraYears} lat</span>
            </div>
            <Slider
              min={0}
              max={10}
              value={extraYears}
              onChange={onExtraYearsChange}
              marks={{
                0: '0',
                5: '5',
                10: '10'
              }}
              tooltip={{ 
                formatter: (value) => `${value} lat więcej pracy`
              }}
            />
            <div className="impact-indicator">
              {extraYears > 0 && (
                <span className="positive-impact">
                  + {formatCurrency(scenarioData.pension - projectedPension)} miesięcznie
                  ({pensionIncrease > 0 ? '+' : ''}{pensionIncrease}%)
                </span>
              )}
            </div>
          </div>
        </Col>
        
        <Col xs={24} md={12}>
          <div className="control-item">
            <div className="control-header">
              <label>Wzrost wynagrodzenia:</label>
              <span className="control-value">+{extraSalary}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={extraSalary}
              onChange={onExtraSalaryChange}
              marks={{
                0: '0%',
                25: '25%',
                50: '50%',
                75: '75%',
                100: '100%'
              }}
              tooltip={{ 
                formatter: (value) => `+${value}% wynagrodzenia`
              }}
            />
            <div className="impact-indicator">
              {extraSalary > 0 && (
                <span className="positive-impact">
                  Kapitał: + {formatCurrency(scenarioData.capital - totalCapitalAccumulated)}
                  ({capitalIncrease > 0 ? '+' : ''}{capitalIncrease}%)
                </span>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {(extraYears > 0 || extraSalary > 0) && (
        <Card className="scenario-summary">
          <Row gutter={16}>
            <Col span={12}>
              <div className="summary-item">
                <div className="summary-label">Nowa emerytura:</div>
                <div className="summary-value highlight">{formatCurrency(scenarioData.pension)}</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="summary-item">
                <div className="summary-label">Wiek emerytalny:</div>
                <div className="summary-value">{scenarioData.retirementAge} lat</div>
              </div>
            </Col>
          </Row>
        </Card>
      )}
    </Card>
  );
};

export default ScenarioControls;
