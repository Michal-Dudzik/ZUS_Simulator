import { getZusRates } from '../../simulator/utils/calculationUtils';
import { pensionData } from '../../simulator/data/pensionData';

/**
 * Calculate alternative scenario with extra years and salary increase
 */
export const calculateScenario = (
  yearsOfWork,
  monthlyIncome,
  employmentType,
  retirementAge,
  valorization,
  additionalYears,
  salaryIncrease,
  t
) => {
  const adjustedYears = yearsOfWork + additionalYears;
  const adjustedIncome = monthlyIncome * (1 + salaryIncrease / 100);
  const rates = getZusRates(employmentType, t);
  const annualContribution = adjustedIncome * 12 * rates.totalRate;
  
  const capital = annualContribution * ((Math.pow(1 + valorization, adjustedYears) - 1) / valorization);
  const lifeExpectancyMonths = 216; // 18 years
  const pension = capital / lifeExpectancyMonths;
  
  return {
    pension,
    capital,
    years: adjustedYears,
    retirementAge: retirementAge + additionalYears
  };
};

/**
 * Generate capital accumulation data over time
 */
export const generateAccumulationData = (
  yearsOfWork,
  currentAge,
  monthlyIncome,
  employmentType,
  valorization,
  extraYears,
  extraSalary,
  t
) => {
  const years = [];
  const baseCapital = [];
  const scenarioCapital = [];
  const averageCapital = [];
  
  const rates = getZusRates(employmentType, t);
  const annualContribution = monthlyIncome * 12 * rates.totalRate;
  const scenarioIncome = monthlyIncome * (1 + extraSalary / 100);
  const scenarioAnnualContribution = scenarioIncome * 12 * rates.totalRate;
  
  // Average Polish worker scenario
  const averageIncome = 7500; // PLN average
  const averageAnnualContribution = averageIncome * 12 * rates.totalRate;

  for (let year = 0; year <= Math.ceil(yearsOfWork + extraYears); year++) {
    years.push((currentAge + year).toString());
    
    // Base scenario
    if (year <= yearsOfWork) {
      const capital = annualContribution * ((Math.pow(1 + valorization, year) - 1) / valorization);
      baseCapital.push(capital);
    } else {
      baseCapital.push(baseCapital[baseCapital.length - 1]);
    }
    
    // Scenario with extra years/salary
    const scenarioYear = Math.min(year, yearsOfWork + extraYears);
    const scenCapital = scenarioAnnualContribution * ((Math.pow(1 + valorization, scenarioYear) - 1) / valorization);
    scenarioCapital.push(scenCapital);
    
    // Average worker
    if (year <= yearsOfWork) {
      const avgCapital = averageAnnualContribution * ((Math.pow(1 + valorization, year) - 1) / valorization);
      averageCapital.push(avgCapital);
    } else {
      averageCapital.push(averageCapital[averageCapital.length - 1]);
    }
  }

  return { years, baseCapital, scenarioCapital, averageCapital };
};

/**
 * Generate pension payout data (capital consumption during retirement)
 */
export const generatePayoutData = (
  retirementAge,
  totalCapitalAccumulated,
  projectedPension,
  scenarioData
) => {
  const years = [];
  const remainingCapital = [];
  const scenarioRemainingCapital = [];
  
  const lifeExpectancyYears = 18;
  const monthlyPension = projectedPension;
  const scenarioMonthlyPension = scenarioData.pension;
  
  let baseRemaining = totalCapitalAccumulated;
  let scenarioRemaining = scenarioData.capital;

  for (let year = 0; year <= lifeExpectancyYears; year++) {
    years.push((retirementAge + year).toString());
    remainingCapital.push(Math.max(0, baseRemaining));
    scenarioRemainingCapital.push(Math.max(0, scenarioRemaining));
    
    baseRemaining -= monthlyPension * 12;
    scenarioRemaining -= scenarioMonthlyPension * 12;
  }

  return { years, remainingCapital, scenarioRemainingCapital };
};

/**
 * Generate comparison data for bar chart
 */
export const generateComparisonData = (projectedPension, scenarioData) => {
  return {
    labels: ['Twoja emerytura', 'Średnia krajowa', 'Emerytura minimalna', 'Scenariusz'],
    values: [
      projectedPension,
      pensionData.currentAverage,
      pensionData.minimumPension,
      scenarioData.pension
    ],
    colors: ['#11783b', '#FFB34F', '#F05E5E', '#3F84D2']
  };
};

/**
 * Calculate percentage changes
 */
export const calculateChanges = (scenarioData, projectedPension, totalCapitalAccumulated) => {
  const pensionIncrease = ((scenarioData.pension - projectedPension) / projectedPension * 100).toFixed(1);
  const capitalIncrease = ((scenarioData.capital - totalCapitalAccumulated) / totalCapitalAccumulated * 100).toFixed(1);
  
  return { pensionIncrease, capitalIncrease };
};
