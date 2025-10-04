import React from 'react';
import { Button, Divider, Alert } from 'antd';
import { EditOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { pensionData } from '../data/pensionData';
import { useLanguage } from '../../../i18n/useLanguage';

const QuickResults = ({ results, onEdit, onContinueToDetailed, resultsRef }) => {
  const { t } = useLanguage();

  if (!results) return null;

  return (
    <div ref={resultsRef}>
      <div className="results-preview">
        <Divider orientation="left">{t('simulator.quick.results.title')}</Divider>
        
        {/* Employment Type Info */}
        <div className="employment-info-card">
          <div className="employment-icon">
            {results.employmentType === 'employment' && '💼'}
            {results.employmentType === 'b2b' && '🤝'}
            {results.employmentType === 'self-employed' && '🏢'}
          </div>
          <div className="employment-details">
            <h4 className="employment-title">
              {results.employmentType === 'employment' && t('simulator.quick.results.employmentContract')}
              {results.employmentType === 'b2b' && t('simulator.quick.results.b2bContract')}
              {results.employmentType === 'self-employed' && t('simulator.quick.results.selfEmployed')}
            </h4>
            <p className="employment-description">{results.employmentDetails.description}</p>
          </div>
        </div>

        {/* Main Result - Projected Monthly Pension */}
        <div className="main-result-card">
          <div className="main-result-content">
            <div className="main-result-icon">🏦</div>
            <div className="main-result-details">
              <h3>{t('simulator.quick.results.mainTitle')}</h3>
              <div className="main-result-amount">{results.projectedPension.toFixed(2)} PLN</div>
              <p className="main-result-description">
                {t('simulator.quick.results.mainDescription', { 
                  years: results.yearsOfWork.toFixed(1), 
                  rate: (results.employmentDetails.totalRate * 100).toFixed(2) 
                })}
              </p>
              {results.minimumPensionApplied && (
                <div className="minimum-pension-notice">
                  <strong>{t('simulator.quick.results.minimumPensionApplied')}</strong><br/>
                  <span className="minimum-info">
                    {t('simulator.quick.results.minimumPensionInfo', {
                      calculated: results.calculatedPension.toFixed(2),
                      minimum: pensionData.minimumPension,
                      requiredYears: results.gender === 'female' ? pensionData.minimumWorkingYearsWomen : pensionData.minimumWorkingYearsMen
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Results */}
        <div className="results-grid">
          {results.employmentDetails.employerRate > 0 && (
            <div className="result-item">
              <span className="result-label">{t('simulator.quick.results.yourZusContribution')}</span>
              <span className="result-value">{results.zusContributionsEmployee.toFixed(2)} PLN</span>
            </div>
          )}
          <div className="result-item">
            <span className="result-label">{t('simulator.quick.results.totalZusContributions')}</span>
            <span className="result-value">{results.zusContributionsTotal.toFixed(2)} PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">{t('simulator.quick.results.annualZusContributions')}</span>
            <span className="result-value">{results.annualZusContributions.toFixed(2)} PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">{t('simulator.quick.results.netIncome')}</span>
            <span className="result-value">{results.netIncome.toFixed(2)} PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">{t('simulator.quick.results.effectiveTaxRate')}</span>
            <span className="result-value">{(results.taxRate * 100).toFixed(1)}%</span>
          </div>
          <div className="result-item">
            <span className="result-label">{t('simulator.quick.results.yearsOfWorkCalculated')}</span>
            <span className="result-value">{results.yearsOfWork.toFixed(1)} {t('simulator.quick.results.yearsUnit')}</span>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: '2rem' }}>
          <Button 
            size="large"
            icon={<EditOutlined />}
            onClick={onEdit}
            style={{ marginRight: '1rem' }}
          >
            Edytuj dane
          </Button>
        </div>

        {/* Continue to Detailed Simulation */}
        <Alert
          message="Chcesz dokładniejszej symulacji?"
          description="Kontynuuj z formularzem szczegółowym, aby uzyskać bardziej precyzyjne wyniki z dodatkowymi opcjami takimi jak waloryzacja, kapitał początkowy i dodatkowe świadczenia."
          type="info"
          showIcon
          style={{ marginTop: '2rem' }}
          action={
            <Button 
              type="primary" 
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={onContinueToDetailed}
            >
              Kontynuuj
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default QuickResults;
