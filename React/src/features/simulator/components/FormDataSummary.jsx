import React from 'react';
import { useLanguage } from '../../../i18n/useLanguage';
import dayjs from 'dayjs';
import './FormDataSummary.css';

const FormDataSummary = ({ formData, results }) => {
  const { t } = useLanguage();

  if (!formData || !results) return null;

  // Format birth date
  const birthDate = formData.birthDate ? dayjs(formData.birthDate).format('DD.MM.YYYY') : '-';
  
  // Format gender
  const gender = formData.gender === 'male' ? t('simulator.quick.form.genderMale') : t('simulator.quick.form.genderFemale');
  
  // Format employment type
  let employmentTypeLabel = '';
  if (results.employmentType === 'employment') {
    employmentTypeLabel = t('simulator.quick.results.employmentContract');
  } else if (results.employmentType === 'b2b') {
    employmentTypeLabel = t('simulator.quick.results.b2bContract');
  } else if (results.employmentType === 'self-employed') {
    employmentTypeLabel = t('simulator.quick.results.selfEmployed');
  }

  // Format additional benefits
  const additionalBenefits = formData.additionalBenefits && formData.additionalBenefits.length > 0
    ? formData.additionalBenefits.map(benefit => {
        if (benefit === 'disability') return t('simulator.detailed.form.disabilityInsurance');
        if (benefit === 'sickness') return t('simulator.detailed.form.sicknessInsurance');
        if (benefit === 'accident') return t('simulator.detailed.form.accidentInsurance');
        return benefit;
      }).join(', ')
    : null;

  return (
    <div className="form-data-summary-print">
      <h2 className="summary-title">Dane Wejściowe Symulacji</h2>
      
      <div className="summary-section">
        <h3>Informacje Osobiste</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Data urodzenia:</span>
            <span className="summary-value">{birthDate}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Płeć:</span>
            <span className="summary-value">{gender}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Obecny wiek:</span>
            <span className="summary-value">{results.currentAge} lat</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Wiek emerytalny:</span>
            <span className="summary-value">{results.retirementAge} lat</span>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h3>Dane Zatrudnienia</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Rok rozpoczęcia pracy:</span>
            <span className="summary-value">{formData.workStartYear || '-'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Lata pracy:</span>
            <span className="summary-value">{results.yearsOfWork.toFixed(1)} lat</span>
          </div>
          <div className="summary-item highlight">
            <span className="summary-label">Miesięczne wynagrodzenie brutto:</span>
            <span className="summary-value">{parseFloat(formData.monthlyIncome).toFixed(2)} PLN</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Rodzaj zatrudnienia:</span>
            <span className="summary-value">{employmentTypeLabel}</span>
          </div>
          {formData.postalCode && (
            <div className="summary-item">
              <span className="summary-label">Kod pocztowy:</span>
              <span className="summary-value">{formData.postalCode}</span>
            </div>
          )}
        </div>
      </div>

      {(formData.initialCapital || formData.zusSubaccount || formData.annualValorization) && (
        <div className="summary-section">
          <h3>Kapitał i Waloryzacja</h3>
          <div className="summary-grid">
            {formData.initialCapital && parseFloat(formData.initialCapital) > 0 && (
              <div className="summary-item">
                <span className="summary-label">Kapitał początkowy:</span>
                <span className="summary-value">{parseFloat(formData.initialCapital).toFixed(2)} PLN</span>
              </div>
            )}
            {formData.zusSubaccount && parseFloat(formData.zusSubaccount) > 0 && (
              <div className="summary-item">
                <span className="summary-label">Subkonto ZUS:</span>
                <span className="summary-value">{parseFloat(formData.zusSubaccount).toFixed(2)} PLN</span>
              </div>
            )}
            {formData.annualValorization && (
              <div className="summary-item">
                <span className="summary-label">Waloryzacja roczna:</span>
                <span className="summary-value">{formData.annualValorization}%</span>
              </div>
            )}
            {formData.valorizationSubaccount && (
              <div className="summary-item">
                <span className="summary-label">Waloryzacja subkonta:</span>
                <span className="summary-value">{formData.valorizationSubaccount}%</span>
              </div>
            )}
            {formData.wageGrowthRate && parseFloat(formData.wageGrowthRate) > 0 && (
              <div className="summary-item">
                <span className="summary-label">Wzrost wynagrodzeń:</span>
                <span className="summary-value">{formData.wageGrowthRate}% rocznie</span>
              </div>
            )}
          </div>
        </div>
      )}

      {(additionalBenefits || formData.considerSickLeave) && (
        <div className="summary-section">
          <h3>Dodatkowe Opcje</h3>
          <div className="summary-grid">
            {additionalBenefits && (
              <div className="summary-item full-width">
                <span className="summary-label">Dodatkowe ubezpieczenia:</span>
                <span className="summary-value">{additionalBenefits}</span>
              </div>
            )}
            {formData.considerSickLeave && (
              <div className="summary-item full-width">
                <span className="summary-label">Zwolnienia chorobowe:</span>
                <span className="summary-value">Uwzględniono {formData.sickLeaveDays || 10} dni rocznie</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormDataSummary;
