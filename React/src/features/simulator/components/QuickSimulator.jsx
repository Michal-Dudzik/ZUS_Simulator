import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Input, Form, Select, Row, Col, Divider, DatePicker } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import { calculateFinalPension, qualifiesForMinimumPension, pensionData } from '../data/pensionData';
import './SimulationContent.css';

const QuickSimulator = () => {
  const [form] = Form.useForm();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
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

  // ZUS contribution rates by employment type (Poland 2024)
  const getZusRates = (employmentType) => {
    const rates = {
      employment: {
        totalRate: 0.1952, // 19.52% total
        employeeRate: 0.0976, // 9.76% employee
        employerRate: 0.0976, // 9.76% employer
        description: "Employment Contract - Employee pays 9.76%, employer pays 9.76%"
      },
      b2b: {
        totalRate: 0.1926, // 19.26% total (self-employed)
        employeeRate: 0.1926, // 19.26% - self-employed pays all
        employerRate: 0, // Self-employed pays everything
        description: "B2B Contract - You pay 19.26% total (social security 9.76% + health insurance 9.5%)"
      },
      'self-employed': {
        totalRate: 0.1926, // 19.26% total
        employeeRate: 0.1926, // Self-employed pays all
        employerRate: 0, // Self-employed pays everything
        description: "Self-employed - You pay 19.26% total ZUS contributions"
      }
    };
    return rates[employmentType] || rates.employment;
  };

  // Function to calculate pension based on provided math
  const obliczEmeryture = (zarobkiMiesieczne, lataPracy, waloryzacja, trwanieZyciaMies, kapitalPoczatkowy = 0, employmentType = 'employment') => {
    const rates = getZusRates(employmentType);
    const skladkaRoczna = zarobkiMiesieczne * 12 * rates.totalRate;

    // suma składek z waloryzacją (ciąg geometryczny)
    const kapital = skladkaRoczna * ((Math.pow(1 + waloryzacja, lataPracy) - 1) / waloryzacja);

    // dodaj kapitał początkowy
    const suma = kapital + kapitalPoczatkowy;

    // wysokość miesięcznej emerytury brutto
    return suma / trwanieZyciaMies;
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const zarobkiMiesieczne = parseFloat(values.monthlyIncome) || 0;
      const waloryzacja = values.waloryzacja / 100; // Convert percentage to decimal
      const kapitalPoczatkowy = parseFloat(values.initialCapital) || 0;
      const employmentType = values.employmentType || 'employment';
      const gender = values.gender || 'male';
      const currentAge = parseInt(values.currentAge) || 25;
      const retirementAge = parseInt(values.retirementAge) || (gender === 'male' ? 65 : 60);

      // Calculate years of work until retirement based on actual age
      let lataPracy = 0;
      if (values.workStartDate) {
        const startDate = new Date(values.workStartDate);
        const currentDate = new Date();
        
        // Calculate current work years since start date
        const currentWorkYears = (currentDate.getFullYear() - startDate.getFullYear()) + (currentDate.getMonth() - startDate.getMonth()) / 12;
        
        // Calculate remaining years until retirement
        const yearsUntilRetirement = retirementAge - currentAge;
        
        // Use current work years if the person has already worked more than they should based on age
        if (currentWorkYears > (currentAge - 18)) {
          lataPracy = Math.max(currentWorkYears, yearsUntilRetirement);
        } else {
          lataPracy = Math.max(yearsUntilRetirement, 0);
        }
        
        // Ensure minimum of 1 year if working
        if (lataPracy < 1) lataPracy = 1;
      } else {
        // If no work start date, calculate based on age to retirement
        lataPracy = Math.max(retirementAge - currentAge, 0);
        if (lataPracy < 1) lataPracy = 1;
      }

      // Default life expectancy: 18 years (216 months)
      const trwanieZyciaMies = 216;

      // Get employment-specific rates
      const rates = getZusRates(employmentType);
      
      // Calculate monthly ZUS contributions based on employment type
      const miesiecznaSkladkaEmployee = zarobkiMiesieczne * rates.employeeRate;
      const miesiecznaSkladkaTotal = zarobkiMiesieczne * rates.totalRate;
      const rocznaSkladka = miesiecznaSkladkaTotal * 12;
      
      // Calculate pension using employment-specific rates
      const calculatedEmerytura = obliczEmeryture(zarobkiMiesieczne, lataPracy, waloryzacja, trwanieZyciaMies, kapitalPoczatkowy, employmentType);
      
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

      setResults({
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

  return (
    <div className="simulation-content quick-simulation">
      <div className="content-header">
        <CalculatorOutlined className="content-icon" />
        <h3>Quick Simulation</h3>
        <p>Get instant results with basic information</p>
      </div>
      
      <Form layout="vertical" className="simulation-form" form={form}>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item 
              label="Current Age" 
              name="currentAge"
              rules={[{ required: true, message: 'Please enter current age' }]}
            >
              <Input 
                placeholder="Enter your age" 
                suffix="years"
                size="large"
                type="number"
                min="18"
                max="85"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item 
              label="Monthly Income (Brutto)" 
              name="monthlyIncome"
              rules={[{ required: true, message: 'Please enter monthly income' }]}
            >
              <Input 
                placeholder="Enter monthly income" 
                suffix="PLN"
                size="large"
                type="number"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item 
              label="Employment Type"
              name="employmentType"
              rules={[{ required: true, message: 'Please select employment type' }]}
              initialValue="employment"
            >
              <Select placeholder="Select employment type" size="large">
                <Select.Option value="employment">📋 Employment Contract</ Select.Option>
                <Select.Option value="b2b">🏢 B2B Contract</Select.Option>
                <Select.Option value="self-employed">👨‍💼 Self-employed</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item 
              label="Gender"
              name="gender"
              rules={[{ required: true, message: 'Please select gender' }]}
              initialValue="male"
            >
              <Select 
                placeholder="Select gender" 
                size="large"
                onChange={updateRetirementAge}
              >
                <Select.Option value="male">👨 Male</Select.Option>
                <Select.Option value="female">👩 Female</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            {/* Empty column for layout balance */}
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item 
              label="Work Start Date"
              name="workStartDate"
              rules={[{ required: true, message: 'Please select work start date' }]}
            >
              <DatePicker 
                placeholder="Select work start date"
                size="large"
                style={{ width: '100%' }}
                picker="month"
                format="MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item 
              label="Annual Valorization (%)"
              name="waloryzacja"
              initialValue={5}
            >
              <Input 
                placeholder="Annual rate" 
                suffix="%"
                size="large"
                type="number"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item 
              label="Initial Capital (Optional)"
              name="initialCapital"
            >
              <Input 
                placeholder="Capital from before 1999" 
                suffix="PLN"
                size="large"
                type="number"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item 
              label="Expected Retirement Age"
              name="retirementAge"
              rules={[{ required: true, message: 'Please enter retirement age' }]}
            >
              <Input 
                placeholder="Retirement age" 
                suffix="years"
                size="large"
                type="number"
                min="50"
                max="80"
              />
            </Form.Item>
          </Col>
        </Row>
        
        <div className="form-actions">
          <Button 
            type="primary" 
            size="large"
            icon={<CalculatorOutlined />}
            className="calculate-button"
            onClick={handleCalculate}
            loading={loading}
          >
            Calculate Retirement
          </Button>
        </div>
      </Form>
      
      {results && (
        <div className="results-preview" ref={resultsRef}>
          <Divider orientation="left">📊 Calculation Results</Divider>
          
          {/* Employment Type Info */}
          <div className="employment-info-card">
            <div className="employment-icon">
              {results.employmentType === 'employment' && '📋'}
              {results.employmentType === 'b2b' && '🏢'}
              {results.employmentType === 'self-employed' && '👨‍💼'}
            </div>
            <div className="employment-details">
              <h4 className="employment-title">
                {results.employmentType === 'employment' && 'Employment Contract'}
                {results.employmentType === 'b2b' && 'B2B Contract'}
                {results.employmentType === 'self-employed' && 'Self-employed'}
              </h4>
              <p className="employment-description">{results.employmentDetails.description}</p>
            </div>
          </div>

          {/* Main Result - Projected Monthly Pension */}
          <div className="main-result-card">
            <div className="main-result-content">
              <div className="main-result-icon">🏦</div>
              <div className="main-result-details">
                <h3>Your Projected Monthly Pension</h3>
                <div className="main-result-amount">{results.projectedPension.toFixed(2)} PLN</div>
                <p className="main-result-description">Based on {results.yearsOfWork.toFixed(1)} years of contributions at {(results.employmentDetails.totalRate * 100).toFixed(2)}% ZUS rate</p>
                {results.minimumPensionApplied && (
                  <div className="minimum-pension-notice">
                    <strong>✨ Minimum pension applied!</strong><br/>
                    <span className="minimum-info">
                      Your calculated pension was {results.calculatedPension.toFixed(2)} PLN, 
                      but you qualify for the minimum pension of {pensionData.minimumPension} PLN 
                      (requires {results.gender === 'female' ? pensionData.minimumWorkingYearsWomen : pensionData.minimumWorkingYearsMen}+ years of work)
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
                <span className="result-label">Your ZUS Contribution (Monthly)</span>
                <span className="result-value">{results.zusContributionsEmployee.toFixed(2)} PLN</span>
              </div>
            )}
            <div className="result-item">
              <span className="result-label">Total ZUS Contributions (Monthly)</span>
              <span className="result-value">{results.zusContributionsTotal.toFixed(2)} PLN</span>
            </div>
            <div className="result-item">
              <span className="result-label">Annual ZUS Contributions</span>
              <span className="result-value">{results.annualZusContributions.toFixed(2)} PLN</span>
            </div>
            <div className="result-item">
              <span className="result-label">Net Income (After Tax & ZUS)</span>
              <span className="result-value">{results.netIncome.toFixed(2)} PLN</span>
            </div>
            <div className="result-item">
              <span className="result-label">Effective Tax Rate</span>
              <span className="result-value">{(results.taxRate * 100).toFixed(1)}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Years of Work Calculated</span>
              <span className="result-value">{results.yearsOfWork.toFixed(1)} years</span>
            </div>
            <div className="result-item">
              <span className="result-label">Current Age</span>
              <span className="result-value">{results.currentAge} years</span>
            </div>
            <div className="result-item">
              <span className="result-label">Expected Retirement Age</span>
              <span className="result-value">{results.retirementAge} years</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Capital Accumulated</span>
              <span className="result-value">{results.totalCapitalAccumulated.toFixed(2)} PLN</span>
            </div>
            <div className="result-item">
              <span className="result-label">Gender & Qualifications</span>
              <span className="result-value">{results.gender === 'male' ? '👨 Men need 25+ years' : '👩 Women need 20+ years'}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Qualifies for Minimum Pension</span>
              <span className="result-value">{results.qualifiedForMinimum ? `✅ Yes (${pensionData.minimumPension} PLN)` : `❌ No (need ${results.gender === 'female' ? pensionData.minimumWorkingYearsWomen : pensionData.minimumWorkingYearsMen}+ years)`}</span>
            </div>
            {results.calculatedPension !== results.projectedPension && (
              <div className="result-item highlighted">
                <span className="result-label">Original Calculated Pension</span>
                <span className="result-value">{results.calculatedPension.toFixed(2)} PLN</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickSimulator;
