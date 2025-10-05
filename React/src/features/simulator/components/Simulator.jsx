import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Form } from 'antd';
import { pensionData } from '../data/pensionData';
import { useLanguage } from '../../../i18n/useLanguage';
import { 
  calculateQuickSimulation, 
  calculateDetailedSimulation,
  prepareApiRequestData,
  calculateCurrentAge
} from '../utils/pensionCalculations';
import { trackSimulatorUsage } from '../../../common/services/analyticsService';
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

      // Extract basic values - support both new and legacy fields
      const monthlyIncome = parseFloat(values.monthlyIncome) || 0;
      const employmentType = values.employmentType || 'employment';
      const gender = values.gender || 'male';
      
      // Calculate current age from birthDate (new) or use currentAge (legacy)
      let currentAge;
      if (values.birthDate) {
        currentAge = calculateCurrentAge(values.birthDate);
      } else {
        currentAge = parseInt(values.currentAge) || 25;
      }
      
      // Get retirement age - support both retirementAge and retirementYear
      let retirementAge;
      if (values.retirementAge) {
        retirementAge = parseInt(values.retirementAge);
      } else if (values.retirementYear && values.birthDate) {
        const birthYear = new Date(values.birthDate).getFullYear();
        retirementAge = parseInt(values.retirementYear) - birthYear;
      } else {
        retirementAge = gender === 'male' ? 65 : 60;
      }

      // Prepare data for API request
      const apiData = prepareApiRequestData(
        values,
        monthlyIncome,
        employmentType,
        gender,
        currentAge,
        retirementAge
      );

      // Send request to API (background operation)
      try {
        const response = await fetch('http://localhost:50031/api/Zus/simple-form', {
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

      // Perform quick simulation calculation
      const results = calculateQuickSimulation(values, t);

      setQuickResults(results);

      // Track usage for analytics
      trackSimulatorUsage({
        type: 'quick',
        monthlyIncome: monthlyIncome,
        employmentType: employmentType,
        gender: gender,
        currentAge: currentAge,
        retirementAge: retirementAge,
        projectedPension: results.projectedPension,
        yearsOfWork: results.yearsOfWork,
        postalCode: values.postalCode || null
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
    const currentYear = new Date().getFullYear();
    
    form.setFieldsValue({
      ...formData,
      // Add detailed-specific default values
      additionalBenefits: [],
      contributionBase: 'actual',
      annualValorization: '5',
      valorizationSubaccount: '5',
      initialCapital: '0',
      zusSubaccount: '0',
      capitalAsOfYear: currentYear.toString(),
      wageGrowthRate: '0'
    });
    setStep('detailed-form');
  };

  const handleDetailedCalculate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Store updated form data
      setFormData(values);

      // Perform detailed simulation calculation
      const results = calculateDetailedSimulation(values, t);

      setDetailedResults(results);

      // Track usage for analytics
      trackSimulatorUsage({
        type: 'detailed',
        monthlyIncome: parseFloat(values.monthlyIncome) || 0,
        employmentType: results.employmentType,
        gender: results.gender,
        currentAge: results.currentAge,
        retirementAge: results.retirementAge,
        projectedPension: results.projectedPension,
        yearsOfWork: results.yearsOfWork,
        valorization: results.valorization,
        initialCapital: results.initialCapital,
        additionalBenefits: results.additionalBenefits.join(','),
        postalCode: values.postalCode || null
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
