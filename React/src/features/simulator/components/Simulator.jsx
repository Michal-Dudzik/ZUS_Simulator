import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Form } from 'antd';
import { calculateFinalPension, qualifiesForMinimumPension, pensionData } from '../data/pensionData';
import { useLanguage } from '../../../i18n/useLanguage';
import { getZusRates, obliczEmeryture, calculateYearsOfWork } from '../utils/calculationUtils';
import QuickForm from './QuickForm';
import QuickResults from './QuickResults';
import DetailedForm from './DetailedForm';
import DetailedResults from './DetailedResults';
import './SimulationContent.css';

const Simulator = () => {
  const { t } = useLanguage();
  const [form] = Form.useForm();
  const [step, setStep] = useState('quick-form'); // 'quick-form', 'quick-results', 'detailed-form', 'detailed-results'
  const [quickResults, setQuickResults] = useState(null);
  const [detailedResults, setDetailedResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({}); // Store form data across steps
  const resultsRef = useRef(null);

  // Function to update retirement age based on gender
  const updateRetirementAge = useCallback((gender) => {
    const defaultAge = gender === 'female' ? pensionData.minimumRetirementAgeWomen : pensionData.minimumRetirementAgeMen;
    form.setFieldsValue({ retirementAge: defaultAge });
  }, [form]);

  // Set initial retirement age based on default gender
  useEffect(() => {
    updateRetirementAge('male'); // Default is 'male'
  }, [updateRetirementAge]);

  const handleQuickCalculate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Store form data for later use
      setFormData(values);

      const zarobkiMiesieczne = parseFloat(values.monthlyIncome) || 0;
      const waloryzacja = 0.05; // Default 5% valorization for quick simulation
      const kapitalPoczatkowy = 0; // No initial capital in quick simulation
      const employmentType = values.employmentType || 'employment';
      const gender = values.gender || 'male';
      const currentAge = parseInt(values.currentAge) || 25;
      const retirementAge = parseInt(values.retirementAge) || (gender === 'male' ? 65 : 60);

      // Prepare data for API request - mapping to SimpleFormResultRequest model
      const apiData = {
        currentAge: parseInt(currentAge),
        monthlyIncome: parseFloat(zarobkiMiesieczne),
        employmentType: employmentType || null,
        gender: gender || null,
        workStartDate: values.workStartDate ? new Date(values.workStartDate).toISOString() : null,
        initialCapital: 0,
        retirementAge: parseInt(retirementAge)
      };

      // Send request to API (background operation)
      try {
        const response = await fetch('https://localhost:50032/api/Zus/simple-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData)
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const apiResult = await response.json();
        console.log('API Response:', apiResult);
      } catch (apiError) {
        console.error('API request failed:', apiError);
      }

      // Calculate years of work
      const lataPracy = calculateYearsOfWork(values, retirementAge, currentAge);

      // Default life expectancy: 18 years (216 months)
      const trwanieZyciaMies = 216;

      // Get employment-specific rates
      const rates = getZusRates(employmentType, t);
      
      // Calculate monthly ZUS contributions based on employment type
      const miesiecznaSkladkaEmployee = zarobkiMiesieczne * rates.employeeRate;
      const miesiecznaSkladkaTotal = zarobkiMiesieczne * rates.totalRate;
      const rocznaSkladka = miesiecznaSkladkaTotal * 12;
      
      // Calculate pension using employment-specific rates
      const calculatedEmerytura = obliczEmeryture(zarobkiMiesieczne, lataPracy, waloryzacja, trwanieZyciaMies, kapitalPoczatkowy, employmentType, t);
      
      // Apply minimum pension rules
      const emerytura = calculateFinalPension(calculatedEmerytura, lataPracy, gender);

      // Calculate net income based on employment type and income tax
      let taxRate = 0.17; // Base income tax rate
      if (employmentType === 'b2b' || employmentType === 'self-employed') {
        taxRate = 0.19; // Higher tax rate for self-employed/B2B
      }
      const netIncome = zarobkiMiesieczne * (1 - rates.employeeRate - taxRate);

      // Check if qualified for minimum pension
      const qualifiedForMinimum = qualifiesForMinimumPension(lataPracy, gender);
      const minimumPensionApplied = qualifiedForMinimum && emerytura > calculatedEmerytura;

      setQuickResults({
        employmentType: employmentType,
        employmentDetails: rates,
        zusContributionsEmployee: miesiecznaSkladkaEmployee,
        zusContributionsTotal: miesiecznaSkladkaTotal,
        annualZusContributions: rocznaSkladka,
        netIncome: netIncome,
        projectedPension: emerytura,
        calculatedPension: calculatedEmerytura,
        yearsOfWork: lataPracy,
        taxRate: taxRate,
        gender: gender,
        currentAge: currentAge,
        retirementAge: retirementAge,
        qualifiedForMinimum: qualifiedForMinimum,
        minimumPensionApplied: minimumPensionApplied,
        totalCapitalAccumulated: rocznaSkladka * ((Math.pow(1 + waloryzacja, lataPracy) - 1) / waloryzacja) + kapitalPoczatkowy
      });

      setStep('quick-results');

      // Auto scroll to results after calculation
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToDetailed = () => {
    // Pre-fill the detailed form with quick form data
    form.setFieldsValue({
      ...formData,
      // Add detailed-specific default values
      additionalBenefits: [],
      contributionBase: 'actual',
      simulationPeriod: 'yearly',
      annualValorization: '5',
      initialCapital: '0',
      zusSubaccount: '0'
    });
    setStep('detailed-form');
  };

  const handleDetailedCalculate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Store updated form data
      setFormData(values);

      const zarobkiMiesieczne = parseFloat(values.monthlyIncome) || 0;
      const waloryzacja = parseFloat(values.annualValorization) / 100 || 0.05;
      const kapitalPoczatkowy = parseFloat(values.initialCapital) || 0;
      const employmentType = values.employmentType || 'employment';
      const gender = values.gender || 'male';
      const currentAge = parseInt(values.currentAge) || 25;
      const retirementAge = parseInt(values.retirementAge) || (gender === 'male' ? 65 : 60);
      const zusSubaccount = parseFloat(values.zusSubaccount) || 0;

      // Calculate years of work
      const lataPracy = calculateYearsOfWork(values, retirementAge, currentAge);

      // Default life expectancy: 18 years (216 months)
      const trwanieZyciaMies = 216;

      // Get employment-specific rates
      const rates = getZusRates(employmentType, t);
      
      // Calculate monthly ZUS contributions based on employment type
      const miesiecznaSkladkaEmployee = zarobkiMiesieczne * rates.employeeRate;
      const miesiecznaSkladkaTotal = zarobkiMiesieczne * rates.totalRate;
      const rocznaSkladka = miesiecznaSkladkaTotal * 12;
      
      // Calculate pension using employment-specific rates and custom valorization
      const calculatedEmerytura = obliczEmeryture(zarobkiMiesieczne, lataPracy, waloryzacja, trwanieZyciaMies, kapitalPoczatkowy, employmentType, t);
      
      // Apply minimum pension rules
      const emerytura = calculateFinalPension(calculatedEmerytura, lataPracy, gender);

      // Calculate additional benefits
      const additionalBenefits = values.additionalBenefits || [];
      let additionalContributions = 0;
      if (additionalBenefits.includes('disability')) additionalContributions += zarobkiMiesieczne * 0.015; // 1.5%
      if (additionalBenefits.includes('sickness')) additionalContributions += zarobkiMiesieczne * 0.0245; // 2.45%
      if (additionalBenefits.includes('accident')) additionalContributions += zarobkiMiesieczne * 0.0167; // 1.67%

      // Calculate net income based on employment type and income tax
      let taxRate = 0.17; // Base income tax rate
      if (employmentType === 'b2b' || employmentType === 'self-employed') {
        taxRate = 0.19; // Higher tax rate for self-employed/B2B
      }
      const netIncome = zarobkiMiesieczne * (1 - rates.employeeRate - taxRate) - additionalContributions;

      // Health insurance contribution (approximate)
      const healthInsurance = zarobkiMiesieczne * 0.09; // 9%

      // Check if qualified for minimum pension
      const qualifiedForMinimum = qualifiesForMinimumPension(lataPracy, gender);
      const minimumPensionApplied = qualifiedForMinimum && emerytura > calculatedEmerytura;

      const totalCapital = rocznaSkladka * ((Math.pow(1 + waloryzacja, lataPracy) - 1) / waloryzacja) + kapitalPoczatkowy + zusSubaccount;

      setDetailedResults({
        employmentType: employmentType,
        employmentDetails: rates,
        zusContributionsEmployee: miesiecznaSkladkaEmployee,
        zusContributionsTotal: miesiecznaSkladkaTotal,
        annualZusContributions: rocznaSkladka,
        netIncome: netIncome,
        projectedPension: emerytura,
        calculatedPension: calculatedEmerytura,
        yearsOfWork: lataPracy,
        taxRate: taxRate,
        gender: gender,
        currentAge: currentAge,
        retirementAge: retirementAge,
        qualifiedForMinimum: qualifiedForMinimum,
        minimumPensionApplied: minimumPensionApplied,
        totalCapitalAccumulated: totalCapital,
        additionalBenefits: additionalBenefits,
        additionalContributions: additionalContributions,
        healthInsurance: healthInsurance,
        valorization: waloryzacja,
        initialCapital: kapitalPoczatkowy,
        zusSubaccount: zusSubaccount
      });

      setStep('detailed-results');

      // Auto scroll to results after calculation
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuickForm = () => {
    form.setFieldsValue(formData);
    setStep('quick-form');
  };

  const handleEditDetailedForm = () => {
    form.setFieldsValue(formData);
    setStep('detailed-form');
  };

  return (
    <div className="simulation-content unified-simulation">
      {step === 'quick-form' && (
        <QuickForm
          form={form}
          onCalculate={handleQuickCalculate}
          loading={loading}
          updateRetirementAge={updateRetirementAge}
        />
      )}
      {step === 'quick-results' && (
        <QuickResults
          results={quickResults}
          onEdit={handleEditQuickForm}
          onContinueToDetailed={handleContinueToDetailed}
          resultsRef={resultsRef}
        />
      )}
      {step === 'detailed-form' && (
        <DetailedForm
          form={form}
          onCalculate={handleDetailedCalculate}
          onBack={() => setStep('quick-results')}
          loading={loading}
          updateRetirementAge={updateRetirementAge}
        />
      )}
      {step === 'detailed-results' && (
        <DetailedResults
          results={detailedResults}
          onEdit={handleEditDetailedForm}
          resultsRef={resultsRef}
        />
      )}
    </div>
  );
};

export default Simulator;
