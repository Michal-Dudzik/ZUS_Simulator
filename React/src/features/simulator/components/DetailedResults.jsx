import React from 'react';
import { Button, Divider } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { pensionData } from '../data/pensionData';
import { useLanguage } from '../../../i18n/useLanguage';

const DetailedResults = ({ results, onEdit, resultsRef }) => {
  const { t } = useLanguage();

  if (!results) return null;

  return (
    <div ref={resultsRef}>
      <div className="results-preview">
        <Divider orientation="left">Szczegółowe wyniki symulacji</Divider>
        
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
              <h3>Przewidywana emerytura miesięczna (brutto)</h3>
              <div className="main-result-amount">{results.projectedPension.toFixed(2)} PLN</div>
              <p className="main-result-description">
                Szacowana emerytura po {results.yearsOfWork.toFixed(1)} latach pracy z waloryzacją {(results.valorization * 100).toFixed(1)}%
              </p>
              {results.minimumPensionApplied && (
                <div className="minimum-pension-notice">
                  <strong>{t('simulator.quick.results.minimumPensionApplied')}</strong><br/>
                  <span className="minimum-info">
                    Twoja obliczona emerytura ({results.calculatedPension.toFixed(2)} PLN) była niższa niż minimalna emerytura ({pensionData.minimumPension} PLN), więc zostanie podwyższona do minimum.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Results Grid */}
        <div className="results-grid detailed">
          <div className="result-item">
            <span className="result-label">Składki ZUS (pracownik)</span>
            <span className="result-value">{results.zusContributionsEmployee.toFixed(2)} PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Składki ZUS (łącznie)</span>
            <span className="result-value">{results.zusContributionsTotal.toFixed(2)} PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Składki ZUS (rocznie)</span>
            <span className="result-value">{results.annualZusContributions.toFixed(2)} PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Ubezpieczenie zdrowotne</span>
            <span className="result-value">{results.healthInsurance.toFixed(2)} PLN</span>
          </div>
          {results.additionalBenefits.length > 0 && (
            <div className="result-item">
              <span className="result-label">Dodatkowe składki</span>
              <span className="result-value">{results.additionalContributions.toFixed(2)} PLN</span>
            </div>
          )}
          <div className="result-item">
            <span className="result-label">Dochód netto</span>
            <span className="result-value">{results.netIncome.toFixed(2)} PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Kapitał początkowy</span>
            <span className="result-value">{results.initialCapital.toFixed(2)} PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Subkonto ZUS</span>
            <span className="result-value">{results.zusSubaccount.toFixed(2)} PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Całkowity kapitał zgromadzony</span>
            <span className="result-value">{results.totalCapitalAccumulated.toFixed(2)} PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Lata pracy</span>
            <span className="result-value">{results.yearsOfWork.toFixed(1)} lat</span>
          </div>
          <div className="result-item">
            <span className="result-label">Wiek emerytalny</span>
            <span className="result-value">{results.retirementAge} lat</span>
          </div>
          <div className="result-item">
            <span className="result-label">Waloryzacja roczna</span>
            <span className="result-value">{(results.valorization * 100).toFixed(1)}%</span>
          </div>
          {results.calculatedPension !== results.projectedPension && (
            <div className="result-item highlighted">
              <span className="result-label">Oryginalna obliczona emerytura</span>
              <span className="result-value">{results.calculatedPension.toFixed(2)} PLN</span>
            </div>
          )}
        </div>

        <div className="form-actions" style={{ marginTop: '2rem' }}>
          <Button 
            size="large"
            icon={<EditOutlined />}
            onClick={onEdit}
          >
            Edytuj szczegóły
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailedResults;
