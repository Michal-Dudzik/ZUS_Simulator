import React, { useState } from 'react';
import { Card } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { getZusRates } from '../../simulator/utils/pensionCalculations';
import { useLanguage } from '../../../i18n/useLanguage';
import {
  calculateScenario,
  generateAccumulationData,
  generatePayoutData,
  generateComparisonData,
  generateContributionBreakdownData,
  generateExpenseForecastData,
  calculateChanges
} from '../utils/visualizationUtils';
import MetricsCards from './MetricsCards';
import ScenarioControls from './ScenarioControls';
import ChartSection from './ChartSection';
import InsightsSection from './InsightsSection';
import StatisticsSection from './StatisticsSection';
import LifestyleComparison from './LifestyleComparison';
import './PensionVisualization.css';

const PensionVisualization = ({ results }) => {
  const { t } = useLanguage();
  
  // State for interactive scenarios
  const [extraYears, setExtraYears] = useState(0);
  const [extraSalary, setExtraSalary] = useState(0);
  const [showComparison, setShowComparison] = useState(true);
  const [chartType, setChartType] = useState('accumulation'); // 'accumulation', 'pension-payout', 'comparison'

  if (!results) {
    return (
      <div className="pension-visualization">
        <Card className="info-card">
          <p>Wykonaj symulację, aby zobaczyć szczegółową wizualizację Twojej przyszłej emerytury.</p>
        </Card>
      </div>
    );
  }

  // Extract data from results
  const {
    projectedPension,
    yearsOfWork,
    currentAge,
    retirementAge,
    totalCapitalAccumulated,
    annualZusContributions,
    employmentType,
    valorization = 0.05
  } = results;

  const monthlyIncome = results.netIncome ? 
    results.netIncome / (1 - getZusRates(employmentType, t).employeeRate - results.taxRate) : 
    3000;

  // Calculate scenarios with extra years and salary
  const scenarioData = calculateScenario(
    yearsOfWork,
    monthlyIncome,
    employmentType,
    retirementAge,
    valorization,
    extraYears,
    extraSalary,
    t
  );

  // Helper function for insights section
  const calculateScenarioHelper = (additionalYears, salaryIncrease) => 
    calculateScenario(
      yearsOfWork,
      monthlyIncome,
      employmentType,
      retirementAge,
      valorization,
      additionalYears,
      salaryIncrease,
      t
    );

  // Generate data for charts
  const accumulationData = generateAccumulationData(
    yearsOfWork,
    currentAge,
    monthlyIncome,
    employmentType,
    valorization,
    extraYears,
    extraSalary,
    t
  );

  const payoutData = generatePayoutData(
    retirementAge,
    totalCapitalAccumulated,
    projectedPension,
    scenarioData
  );

  const comparisonData = generateComparisonData(projectedPension, scenarioData);

  const contributionBreakdownData = generateContributionBreakdownData(
    yearsOfWork,
    currentAge,
    monthlyIncome,
    employmentType,
    valorization,
    t
  );

  const expenseForecastData = generateExpenseForecastData(
    retirementAge,
    projectedPension,
    scenarioData
  );

  // Calculate percentage changes
  const { pensionIncrease, capitalIncrease } = calculateChanges(
    scenarioData,
    projectedPension,
    totalCapitalAccumulated
  );

  return (
    <div className="pension-visualization-enhanced">
      <div className="visualization-header">
        <h2>
          <LineChartOutlined /> Wizualizacja Twojej Emerytury
        </h2>
        <p className="subtitle">
          Interaktywna analiza kapitału emerytalnego i prognoz na przyszłość
        </p>
      </div>

      {/* Key Metrics Cards - 2x2 Grid */}
      <MetricsCards
        projectedPension={projectedPension}
        totalCapitalAccumulated={totalCapitalAccumulated}
        retirementAge={retirementAge}
        yearsOfWork={yearsOfWork}
        monthlyIncome={monthlyIncome}
      />

      {/* Interactive Scenario Controls */}
      <ScenarioControls
        extraYears={extraYears}
        extraSalary={extraSalary}
        onExtraYearsChange={setExtraYears}
        onExtraSalaryChange={setExtraSalary}
        scenarioData={scenarioData}
        projectedPension={projectedPension}
        totalCapitalAccumulated={totalCapitalAccumulated}
        pensionIncrease={pensionIncrease}
        capitalIncrease={capitalIncrease}
      />

      {/* Chart Section with Type Selector */}
      <ChartSection
        chartType={chartType}
        onChartTypeChange={setChartType}
        showComparison={showComparison}
        onShowComparisonChange={setShowComparison}
        accumulationData={accumulationData}
        payoutData={payoutData}
        comparisonData={comparisonData}
        contributionBreakdownData={contributionBreakdownData}
        expenseForecastData={expenseForecastData}
        extraYears={extraYears}
        extraSalary={extraSalary}
        valorization={valorization}
      />

      {/* Lifestyle Comparison Section */}
      <LifestyleComparison
        projectedPension={projectedPension}
        totalCapitalAccumulated={totalCapitalAccumulated}
      />

      {/* Insights and Tips */}
      <InsightsSection
        projectedPension={projectedPension}
        calculateScenario={calculateScenarioHelper}
      />

      {/* Additional Statistics */}
      <StatisticsSection
        annualZusContributions={annualZusContributions}
        yearsOfWork={yearsOfWork}
        totalCapitalAccumulated={totalCapitalAccumulated}
        projectedPension={projectedPension}
      />
    </div>
  );
};

export default PensionVisualization;