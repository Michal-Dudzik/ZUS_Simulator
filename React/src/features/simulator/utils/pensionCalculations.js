// ============================================================================
// CONSOLIDATED PENSION CALCULATION LOGIC
// ============================================================================
// This file contains all pension calculation logic for the ZUS Simulator.
// It includes contribution calculations, pension projections, tax calculations,
// and all related helper functions.

import { pensionData } from '../data/pensionData';

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

// ZUS contribution rates by employment type (Poland 2024)
const ZUS_RATES = {
  employment: {
    totalRate: 0.1952, // 19.52% total
    employeeRate: 0.0976, // 9.76% employee
    employerRate: 0.0976, // 9.76% employer
  },
  b2b: {
    totalRate: 0.1926, // 19.26% total (self-employed)
    employeeRate: 0.1926, // 19.26% - self-employed pays all
    employerRate: 0, // Self-employed pays everything
  },
  'self-employed': {
    totalRate: 0.1926, // 19.26% total
    employeeRate: 0.1926, // Self-employed pays all
    employerRate: 0, // Self-employed pays everything
  }
};

// Tax rates by employment type
const TAX_RATES = {
  employment: 0.17, // 17% income tax for employment contracts
  b2b: 0.19, // 19% income tax for B2B contracts
  'self-employed': 0.19, // 19% income tax for self-employed
};

// Additional insurance rates
const ADDITIONAL_INSURANCE_RATES = {
  disability: 0.015, // 1.5%
  sickness: 0.0245, // 2.45%
  accident: 0.0167, // 1.67%
  health: 0.09, // 9%
};

// Default values for calculations
const DEFAULTS = {
  valorization: 0.05, // 5% annual valorization
  lifeExpectancyMonths: 216, // 18 years (216 months) - fallback only
  initialCapital: 0,
  wageGrowthRate: 0, // 0% wage growth by default
};

// Capitalization defaults
const CAPITALIZATION_DEFAULTS = {
  valorizationAccount: 0.05,     // 5% for main account
  valorizationSubaccount: 0.05,  // 5% for subaccount (can be different)
};

// Validation constraints
const VALIDATION_CONSTRAINTS = {
  minWorkStartAge: 16, // Minimum age to start working
  minRetirementAge: 50, // Minimum retirement age
  maxRetirementAge: 80, // Maximum retirement age
  maxWorkYears: 65, // Maximum years of work
  wageGrowthRateMin: 0, // Minimum wage growth rate (%)
  wageGrowthRateMax: 8, // Maximum wage growth rate (%)
  sickLeaveDaysMin: 0, // Minimum sick leave days per year
  sickLeaveDaysMax: 365, // Maximum sick leave days per year
};

// Contribution base caps
const CAPS = {
  // Annual contribution base cap (30x average salary) - set to Infinity if not applicable
  annualContributionBaseCap: Infinity, // In production, use actual limit value
};

// Life expectancy table (months) by retirement age
// Based on approximations - should be updated with official tables
const LIFE_TABLE = {
  60: 260,
  61: 252,
  62: 244,
  63: 236,
  64: 228,
  65: 220,
  66: 212,
  67: 204,
  68: 196,
  69: 188,
  70: 180,
  71: 172,
  72: 164,
  73: 156,
  74: 148,
  75: 140,
  76: 132,
  77: 124,
  78: 116,
  79: 108,
  80: 100,
  81: 92,
  82: 84,
  83: 76,
  84: 68,
  85: 60,
  86: 52,
  87: 44,
  88: 36,
  89: 28,
  90: 20,
  91: 12,
  92: 4,
  // Add more ages as needed
};

// ============================================================================
// EMPLOYMENT TYPE UTILITIES
// ============================================================================

/**
 * Get ZUS contribution rates for a given employment type with localized descriptions
 * @param {string} employmentType - Type of employment (employment, b2b, self-employed)
 * @param {Function} t - Translation function (optional, defaults to identity function)
 * @returns {Object} Rate object with totalRate, employeeRate, employerRate, and description
 */
export const getZusRates = (employmentType, t = (x) => x) => {
  const rates = ZUS_RATES[employmentType] || ZUS_RATES.employment;
  
  // Add localized description
  const descriptionKey = {
    employment: 'simulator.quick.results.employmentDescription.employment',
    b2b: 'simulator.quick.results.employmentDescription.b2b',
    'self-employed': 'simulator.quick.results.employmentDescription.selfEmployed'
  }[employmentType] || 'simulator.quick.results.employmentDescription.employment';
  
  return {
    ...rates,
    description: t(descriptionKey)
  };
};

/**
 * Get tax rate for a given employment type
 * @param {string} employmentType - Type of employment
 * @returns {number} Tax rate as decimal (e.g., 0.17 for 17%)
 */
export const getTaxRate = (employmentType) => {
  return TAX_RATES[employmentType] || TAX_RATES.employment;
};

// ============================================================================
// TIME AND AGE CALCULATIONS
// ============================================================================

/**
 * Calculate current age from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {number} Current age in complete years
 */
export const calculateCurrentAge = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    (today.getMonth() < birth.getMonth()) ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  
  if (beforeBirthday) age -= 1;
  
  return Math.max(0, age);
};

/**
 * Calculate retirement year from birth date and retirement age
 * @param {Date|string} birthDate - Birth date
 * @param {number} retirementAge - Retirement age
 * @returns {number} Retirement year
 */
export const calculateRetirementYear = (birthDate, retirementAge) => {
  const birth = new Date(birthDate);
  return birth.getFullYear() + retirementAge;
};

/**
 * Calculate retirement age from birth date and retirement year
 * @param {Date|string} birthDate - Birth date
 * @param {number} retirementYear - Retirement year
 * @returns {number} Retirement age
 */
export const calculateRetirementAge = (birthDate, retirementYear) => {
  const birth = new Date(birthDate);
  return retirementYear - birth.getFullYear();
};

/**
 * Get life expectancy in months based on retirement age and gender
 * @param {number} ageAtRetirement - Age at retirement
 * @param {string} gender - Gender (male/female)
 * @returns {number} Life expectancy in months
 */
export const getLifeExpectancyMonths = (ageAtRetirement, gender) => {
  // If exact age is in table, return it
  if (LIFE_TABLE[ageAtRetirement] != null) return LIFE_TABLE[ageAtRetirement];

  // Get sorted ages from table
  const ages = Object.keys(LIFE_TABLE).map(Number).sort((a, b) => a - b);
  if (ages.length === 0) return DEFAULTS.lifeExpectancyMonths;

  // Clamp to nearest available age in table
  const minAge = ages[0];
  const maxAge = ages[ages.length - 1];
  const clamped = Math.max(minAge, Math.min(maxAge, ageAtRetirement));
  
  return LIFE_TABLE[clamped] ?? DEFAULTS.lifeExpectancyMonths;
};

/**
 * Calculate years of work until retirement with proper bounds and validation
 * Uses birthDate and workStartYear for accurate calculation
 * @param {Object} values - Form values containing birthDate, workStartYear, retirementAge/retirementYear
 * @param {number} retirementAge - Retirement age
 * @param {number} currentAge - Current age (calculated from birthDate)
 * @returns {number} Total years of work (clamped to [0, 65])
 */
export const calculateYearsOfWork = (values, retirementAge, currentAge) => {
  const clamp = (x, min, max) => Math.max(min, Math.min(max, x));

  let workStartYear;
  let retirementYear;

  // Get workStartYear - prefer direct value, fallback to workStartDate (DatePicker)
  if (values.workStartYear) {
    workStartYear = parseInt(values.workStartYear);
  } else if (values.workStartDate) {
    // Legacy support for DatePicker format
    const startDate = new Date(values.workStartDate);
    workStartYear = startDate.getFullYear();
  } else {
    // Fallback: assume started 1 year ago
    workStartYear = new Date().getFullYear() - 1;
  }

  // Get retirementYear - prefer direct value, calculate from birthDate + retirementAge
  if (values.retirementYear) {
    retirementYear = parseInt(values.retirementYear);
  } else if (values.birthDate && retirementAge) {
    retirementYear = calculateRetirementYear(values.birthDate, retirementAge);
  } else {
    // Fallback: current year + (retirementAge - currentAge)
    retirementYear = new Date().getFullYear() + (retirementAge - currentAge);
  }

  // Calculate years of work (January-to-January system)
  let years = retirementYear - workStartYear;
  years = Math.floor(years);

  // Safety bounds: years of work should be between 0 and maxWorkYears
  return clamp(years, 0, VALIDATION_CONSTRAINTS.maxWorkYears);
};

// ============================================================================
// MINIMUM PENSION RULES
// ============================================================================

/**
 * Check if user qualifies for minimum pension based on years of work, gender, and retirement age
 * @param {number} yearsOfWork - Total years of work
 * @param {string} gender - Gender (male/female)
 * @param {number} retirementAge - Age at retirement
 * @returns {boolean} True if qualified for minimum pension
 */
export const qualifiesForMinimumPension = (yearsOfWork, gender, retirementAge) => {
  const minYears = gender === 'female'
    ? pensionData.minimumWorkingYearsWomen
    : pensionData.minimumWorkingYearsMen;

  const minAge = gender === 'female'
    ? pensionData.minimumRetirementAgeWomen
    : pensionData.minimumRetirementAgeMen;

  return yearsOfWork >= minYears && retirementAge >= minAge;
};

/**
 * Apply minimum pension rules to calculated pension
 * @param {number} calculatedPension - Calculated pension amount
 * @param {number} yearsOfWork - Total years of work
 * @param {string} gender - Gender (male/female)
 * @param {number} retirementAge - Age at retirement
 * @returns {number} Final pension amount (with minimum applied if qualified)
 */
export const calculateFinalPension = (calculatedPension, yearsOfWork, gender, retirementAge) => {
  const qualified = qualifiesForMinimumPension(yearsOfWork, gender, retirementAge);
  return qualified ? Math.max(calculatedPension, pensionData.minimumPension) : calculatedPension;
};

// ============================================================================
// CORE PENSION CALCULATION
// ============================================================================

/**
 * Helper function to clamp annual contribution base (30x salary cap)
 * @param {number} grossMonthly - Monthly gross income
 * @param {number} annualCap - Annual contribution base cap
 * @returns {number} Capped annual gross income
 */
const clampAnnualBase = (grossMonthly, annualCap) => {
  const annualGross = grossMonthly * 12;
  const cappedAnnualGross = Math.min(annualGross, annualCap);
  return cappedAnnualGross;
};

/**
 * Calculate annual contribution with cap applied (consistent with calculatePension)
 * @param {number} monthlyIncome - Monthly gross income
 * @param {string} employmentType - Type of employment
 * @param {Function} t - Translation function
 * @param {number} annualContributionBaseCap - Annual contribution base cap
 * @returns {number} Annual contribution amount (capped)
 */
export const getAnnualContribution = (monthlyIncome, employmentType, t, annualContributionBaseCap) => {
  const rates = getZusRates(employmentType, t);
  const cappedAnnualBase = isFinite(annualContributionBaseCap)
    ? clampAnnualBase(monthlyIncome, annualContributionBaseCap)
    : monthlyIncome * 12;
  return cappedAnnualBase * rates.totalRate;
};

/**
 * Calculate monthly pension based on contributions and valorization
 * This is the core pension calculation function with consistent capitalization.
 * 
 * @param {number} monthlyIncome - Monthly income in PLN
 * @param {number} yearsOfWork - Total years of work
 * @param {number} valorization - Annual valorization rate (e.g., 0.05 for 5%)
 * @param {number} lifeExpectancyMonths - Expected months of pension collection
 * @param {number} initialCapital - Initial capital on ZUS account
 * @param {string} employmentType - Type of employment
 * @param {Function} t - Translation function
 * @param {Object} options - Additional options (annualContributionBaseCap, zusSubaccount, valorizationSubaccount, wageGrowthRate, capitalAsOfYear)
 * @returns {number} Calculated monthly pension amount
 */
export const calculatePension = (
  monthlyIncome,
  yearsOfWork,
  valorization = DEFAULTS.valorization,
  lifeExpectancyMonths = DEFAULTS.lifeExpectancyMonths,
  initialCapital = DEFAULTS.initialCapital,
  employmentType = 'employment',
  t,
  options = {}
) => {
  const { 
    annualContributionBaseCap = CAPS.annualContributionBaseCap,
    zusSubaccount = 0,
    valorizationSubaccount = valorization,
    wageGrowthRate = DEFAULTS.wageGrowthRate,
    capitalAsOfYear = new Date().getFullYear()
  } = options;
  
  const rates = getZusRates(employmentType, t);

  // Apply annual contribution base cap (30x salary limit) if set
  const cappedAnnualBase = isFinite(annualContributionBaseCap)
    ? clampAnnualBase(monthlyIncome, annualContributionBaseCap)
    : monthlyIncome * 12;

  const annualContribution = cappedAnnualBase * rates.totalRate;

  // Calculate total capital using consistent formula with wage growth and capitalAsOfYear
  const totalCapital = calculateTotalCapital(
    annualContribution,
    yearsOfWork,
    valorization,
    initialCapital,
    zusSubaccount,
    valorizationSubaccount,
    {
      capitalAsOfYear: capitalAsOfYear,
      currentYear: new Date().getFullYear(),
      wageGrowthRate: wageGrowthRate
    }
  );

  // Calculate monthly pension
  return totalCapital / Math.max(1, lifeExpectancyMonths);
};

// ============================================================================
// CONTRIBUTION CALCULATIONS
// ============================================================================

/**
 * Calculate ZUS contributions breakdown
 * @param {number} monthlyIncome - Monthly income in PLN
 * @param {string} employmentType - Type of employment
 * @param {Function} t - Translation function
 * @returns {Object} Object with employee, total, and annual contributions
 */
export const calculateZusContributions = (monthlyIncome, employmentType, t) => {
  const rates = getZusRates(employmentType, t);
  
  return {
    employee: monthlyIncome * rates.employeeRate,
    total: monthlyIncome * rates.totalRate,
    annual: monthlyIncome * rates.totalRate * 12,
    rates: rates
  };
};

/**
 * Calculate additional benefits contributions
 * @param {number} monthlyIncome - Monthly income in PLN
 * @param {Array<string>} benefits - Array of benefit types (disability, sickness, accident)
 * @returns {number} Total additional contributions
 */
export const calculateAdditionalContributions = (monthlyIncome, benefits = []) => {
  let total = 0;
  
  if (benefits.includes('disability')) {
    total += monthlyIncome * ADDITIONAL_INSURANCE_RATES.disability;
  }
  if (benefits.includes('sickness')) {
    total += monthlyIncome * ADDITIONAL_INSURANCE_RATES.sickness;
  }
  if (benefits.includes('accident')) {
    total += monthlyIncome * ADDITIONAL_INSURANCE_RATES.accident;
  }
  
  return total;
};

/**
 * Calculate health insurance contribution
 * @param {number} monthlyIncome - Monthly income in PLN
 * @returns {number} Health insurance contribution
 */
export const calculateHealthInsurance = (monthlyIncome) => {
  return monthlyIncome * ADDITIONAL_INSURANCE_RATES.health;
};

// ============================================================================
// NET INCOME CALCULATIONS
// ============================================================================

/**
 * Calculate net income after ZUS contributions and taxes
 * @param {number} monthlyIncome - Monthly gross income
 * @param {string} employmentType - Type of employment
 * @param {Function} t - Translation function
 * @returns {number} Net monthly income
 */
export const calculateNetIncome = (monthlyIncome, employmentType, t) => {
  const rates = getZusRates(employmentType, t);
  const taxRate = getTaxRate(employmentType);
  
  return monthlyIncome * (1 - rates.employeeRate - taxRate);
};

/**
 * Calculate net income with additional deductions
 * @param {number} monthlyIncome - Monthly gross income
 * @param {string} employmentType - Type of employment
 * @param {number} additionalContributions - Additional contributions amount
 * @param {Function} t - Translation function
 * @returns {number} Net monthly income with all deductions
 */
export const calculateNetIncomeDetailed = (monthlyIncome, employmentType, additionalContributions, t) => {
  const baseNetIncome = calculateNetIncome(monthlyIncome, employmentType, t);
  return baseNetIncome - additionalContributions;
};

// ============================================================================
// WAGE GROWTH CALCULATIONS
// ============================================================================

/**
 * Calculate average monthly income over work period with wage growth
 * @param {number} currentMonthlyIncome - Current monthly income
 * @param {number} yearsOfWork - Years of work
 * @param {number} wageGrowthRate - Annual wage growth rate (e.g., 0.03 for 3%)
 * @returns {number} Average monthly income accounting for wage growth
 */
export const calculateAverageIncomeWithGrowth = (currentMonthlyIncome, yearsOfWork, wageGrowthRate = 0) => {
  if (wageGrowthRate === 0 || yearsOfWork <= 0) {
    return currentMonthlyIncome;
  }

  // Calculate average using geometric series
  // Average = P * (1 - (1+g)^n) / (n * (1 - (1+g)))
  // Simplified for practical use: use the income at mid-point of career
  const midCareerIncome = currentMonthlyIncome * Math.pow(1 + wageGrowthRate, yearsOfWork / 2);
  return midCareerIncome;
};

/**
 * Calculate total contributions with wage growth
 * @param {number} currentMonthlyIncome - Current monthly income
 * @param {number} yearsOfWork - Years of work
 * @param {number} wageGrowthRate - Annual wage growth rate
 * @param {number} zusRate - ZUS contribution rate
 * @returns {number} Total accumulated contributions with wage growth
 */
export const calculateTotalContributionsWithGrowth = (
  currentMonthlyIncome,
  yearsOfWork,
  wageGrowthRate = 0,
  zusRate
) => {
  if (wageGrowthRate === 0 || yearsOfWork <= 0) {
    return currentMonthlyIncome * 12 * zusRate * yearsOfWork;
  }

  // Sum of contributions with wage growth: C * sum((1+g)^i) for i=0 to n-1
  // = C * ((1+g)^n - 1) / g
  const annualContribution = currentMonthlyIncome * 12 * zusRate;
  return annualContribution * ((Math.pow(1 + wageGrowthRate, yearsOfWork) - 1) / wageGrowthRate);
};

// ============================================================================
// CAPITAL ACCUMULATION CALCULATIONS
// ============================================================================

/**
 * Calculate total capital accumulated using geometric series formula with proper valorization
 * Supports capitalAsOfYear for adjusting initial capital and subaccount valorization
 * @param {number} annualContribution - Annual contribution amount (can be adjusted for wage growth)
 * @param {number} yearsOfWork - Years of work
 * @param {number} valorizationAccount - Annual valorization rate for main account
 * @param {number} initialCapital - Initial capital (will be valorized)
 * @param {number} zusSubaccount - Additional ZUS subaccount amount (will be valorized)
 * @param {number} valorizationSubaccount - Annual valorization rate for subaccount
 * @param {Object} options - Additional options (capitalAsOfYear, currentYear, wageGrowthRate)
 * @returns {number} Total accumulated capital
 */
export const calculateTotalCapital = (
  annualContribution,
  yearsOfWork,
  valorizationAccount = CAPITALIZATION_DEFAULTS.valorizationAccount,
  initialCapital = 0,
  zusSubaccount = 0,
  valorizationSubaccount = CAPITALIZATION_DEFAULTS.valorizationSubaccount,
  options = {}
) => {
  const {
    capitalAsOfYear = new Date().getFullYear(),
    currentYear = new Date().getFullYear(),
    wageGrowthRate = 0
  } = options;

  if (yearsOfWork <= 0) {
    return initialCapital + zusSubaccount;
  }

  // Calculate capital from contributions
  // If wage growth is present, contributions increase each year
  let capFromContrib;
  if (wageGrowthRate === 0) {
    // Standard geometric series: Sum = a * ((1+v)^n - 1) / v
    capFromContrib = valorizationAccount === 0
      ? annualContribution * yearsOfWork
      : annualContribution * ((Math.pow(1 + valorizationAccount, yearsOfWork) - 1) / valorizationAccount);
  } else {
    // With wage growth: contributions grow at rate g, valorized at rate v
    // More complex series, use approximation or iterative calculation
    capFromContrib = 0;
    for (let i = 0; i < yearsOfWork; i++) {
      const contributionThisYear = annualContribution * Math.pow(1 + wageGrowthRate, i);
      const yearsToGrow = yearsOfWork - i;
      capFromContrib += contributionThisYear * Math.pow(1 + valorizationAccount, yearsToGrow);
    }
  }

  // Calculate years from capitalAsOfYear to retirement
  const yearsFromCapitalRef = yearsOfWork - (currentYear - capitalAsOfYear);
  const capitalValorizationYears = Math.max(0, yearsFromCapitalRef);

  // Valorize initial capital and subaccount from reference year to retirement
  const initialCapFV = initialCapital * Math.pow(1 + valorizationAccount, capitalValorizationYears);
  const subaccountFV = zusSubaccount * Math.pow(1 + valorizationSubaccount, capitalValorizationYears);

  return capFromContrib + initialCapFV + subaccountFV;
};

// ============================================================================
// QUICK SIMULATION CALCULATION
// ============================================================================

/**
 * Perform quick pension calculation with basic parameters
 * @param {Object} formValues - Form values from quick simulation
 * @param {Function} t - Translation function
 * @returns {Object} Quick simulation results
 */
export const calculateQuickSimulation = (formValues, t) => {
  // Extract and parse form values
  const monthlyIncome = parseFloat(formValues.monthlyIncome) || 0;
  const employmentType = formValues.employmentType || 'employment';
  const gender = formValues.gender || 'male';
  
  // Support both birthDate (new) and currentAge (legacy)
  let currentAge;
  if (formValues.birthDate) {
    currentAge = calculateCurrentAge(formValues.birthDate);
  } else {
    currentAge = parseInt(formValues.currentAge) || 25;
  }
  
  // Support both retirementYear (new) and retirementAge (legacy)
  let retirementAge;
  if (formValues.retirementYear && formValues.birthDate) {
    retirementAge = calculateRetirementAge(formValues.birthDate, formValues.retirementYear);
  } else if (formValues.retirementAge) {
    retirementAge = parseInt(formValues.retirementAge);
  } else {
    retirementAge = gender === 'male' ? pensionData.minimumRetirementAgeMen : pensionData.minimumRetirementAgeWomen;
  }
  
  // Calculate years of work
  const yearsOfWork = calculateYearsOfWork(formValues, retirementAge, currentAge);
  
  // Get life expectancy months based on retirement age and gender
  const lifeMonths = getLifeExpectancyMonths(retirementAge, gender);
  
  // Get employment-specific rates
  const zusContributions = calculateZusContributions(monthlyIncome, employmentType, t);
  
  // Calculate annual contribution with cap (consistent with pension calculation)
  const annualContribution = getAnnualContribution(
    monthlyIncome,
    employmentType,
    t,
    CAPS.annualContributionBaseCap
  );
  
  // Calculate pension (with default 5% valorization, no initial capital)
  const calculatedPension = calculatePension(
    monthlyIncome,
    yearsOfWork,
    DEFAULTS.valorization,
    lifeMonths,
    DEFAULTS.initialCapital,
    employmentType,
    t,
    { annualContributionBaseCap: CAPS.annualContributionBaseCap }
  );
  
  // Apply minimum pension rules (with retirement age check)
  const finalPension = calculateFinalPension(calculatedPension, yearsOfWork, gender, retirementAge);
  
  // Calculate net income
  const netIncome = calculateNetIncome(monthlyIncome, employmentType, t);
  
  // Calculate total capital (consistent with calculatePension - uses capped contribution)
  const totalCapital = calculateTotalCapital(
    annualContribution,
    yearsOfWork,
    DEFAULTS.valorization,
    DEFAULTS.initialCapital,
    0
  );
  
  // Check minimum pension qualification
  const qualifiedForMinimum = qualifiesForMinimumPension(yearsOfWork, gender, retirementAge);
  const minimumPensionApplied = qualifiedForMinimum && finalPension > calculatedPension;
  
  return {
    employmentType: employmentType,
    employmentDetails: zusContributions.rates,
    zusContributionsEmployee: zusContributions.employee,
    zusContributionsTotal: zusContributions.total,
    annualZusContributions: zusContributions.annual,
    netIncome: netIncome,
    projectedPension: finalPension,
    calculatedPension: calculatedPension,
    yearsOfWork: yearsOfWork,
    taxRate: getTaxRate(employmentType),
    gender: gender,
    currentAge: currentAge,
    retirementAge: retirementAge,
    qualifiedForMinimum: qualifiedForMinimum,
    minimumPensionApplied: minimumPensionApplied,
    totalCapitalAccumulated: totalCapital
  };
};

// ============================================================================
// DETAILED SIMULATION CALCULATION
// ============================================================================

/**
 * Perform detailed pension calculation with advanced parameters
 * @param {Object} formValues - Form values from detailed simulation
 * @param {Function} t - Translation function
 * @returns {Object} Detailed simulation results
 */
export const calculateDetailedSimulation = (formValues, t) => {
  // Extract and parse form values
  const monthlyIncome = parseFloat(formValues.monthlyIncome) || 0;
  const valorization = parseFloat(formValues.annualValorization) / 100 || DEFAULTS.valorization;
  const valorizationSubaccount = parseFloat(formValues.valorizationSubaccount) / 100 || valorization;
  const initialCapital = parseFloat(formValues.initialCapital) || 0;
  const employmentType = formValues.employmentType || 'employment';
  const gender = formValues.gender || 'male';
  const zusSubaccount = parseFloat(formValues.zusSubaccount) || 0;
  const additionalBenefits = formValues.additionalBenefits || [];
  const wageGrowthRate = parseFloat(formValues.wageGrowthRate) / 100 || DEFAULTS.wageGrowthRate;
  const capitalAsOfYear = parseInt(formValues.capitalAsOfYear) || new Date().getFullYear();
  
  // Support both birthDate (new) and currentAge (legacy)
  let currentAge;
  if (formValues.birthDate) {
    currentAge = calculateCurrentAge(formValues.birthDate);
  } else {
    currentAge = parseInt(formValues.currentAge) || 25;
  }
  
  // Support both retirementYear (new) and retirementAge (legacy)
  let retirementAge;
  if (formValues.retirementYear && formValues.birthDate) {
    retirementAge = calculateRetirementAge(formValues.birthDate, formValues.retirementYear);
  } else if (formValues.retirementAge) {
    retirementAge = parseInt(formValues.retirementAge);
  } else {
    retirementAge = gender === 'male' ? pensionData.minimumRetirementAgeMen : pensionData.minimumRetirementAgeWomen;
  }
  
  // Calculate years of work
  const yearsOfWork = calculateYearsOfWork(formValues, retirementAge, currentAge);
  
  // Get life expectancy months based on retirement age and gender
  const lifeMonths = getLifeExpectancyMonths(retirementAge, gender);
  
  // Get employment-specific rates
  const zusContributions = calculateZusContributions(monthlyIncome, employmentType, t);
  
  // Calculate annual contribution with cap (consistent with pension calculation)
  const annualContribution = getAnnualContribution(
    monthlyIncome,
    employmentType,
    t,
    CAPS.annualContributionBaseCap
  );
  
  // Calculate pension with custom parameters including wage growth
  const calculatedPension = calculatePension(
    monthlyIncome,
    yearsOfWork,
    valorization,
    lifeMonths,
    initialCapital,
    employmentType,
    t,
    {
      annualContributionBaseCap: CAPS.annualContributionBaseCap,
      zusSubaccount: zusSubaccount,
      valorizationSubaccount: valorizationSubaccount,
      wageGrowthRate: wageGrowthRate,
      capitalAsOfYear: capitalAsOfYear
    }
  );
  
  // Apply minimum pension rules (with retirement age check)
  const finalPension = calculateFinalPension(calculatedPension, yearsOfWork, gender, retirementAge);
  
  // Calculate additional benefits contributions
  const additionalContributions = calculateAdditionalContributions(monthlyIncome, additionalBenefits);
  
  // Calculate health insurance
  const healthInsurance = calculateHealthInsurance(monthlyIncome);
  
  // Calculate net income with additional deductions
  const netIncome = calculateNetIncomeDetailed(monthlyIncome, employmentType, additionalContributions, t);
  
  // Calculate total capital with wage growth and capitalAsOfYear support
  const totalCapital = calculateTotalCapital(
    annualContribution,
    yearsOfWork,
    valorization,
    initialCapital,
    zusSubaccount,
    valorizationSubaccount,
    {
      capitalAsOfYear: capitalAsOfYear,
      currentYear: new Date().getFullYear(),
      wageGrowthRate: wageGrowthRate
    }
  );
  
  // Check minimum pension qualification
  const qualifiedForMinimum = qualifiesForMinimumPension(yearsOfWork, gender, retirementAge);
  const minimumPensionApplied = qualifiedForMinimum && finalPension > calculatedPension;
  
  return {
    employmentType: employmentType,
    employmentDetails: zusContributions.rates,
    zusContributionsEmployee: zusContributions.employee,
    zusContributionsTotal: zusContributions.total,
    annualZusContributions: zusContributions.annual,
    netIncome: netIncome,
    projectedPension: finalPension,
    calculatedPension: calculatedPension,
    yearsOfWork: yearsOfWork,
    taxRate: getTaxRate(employmentType),
    gender: gender,
    currentAge: currentAge,
    retirementAge: retirementAge,
    qualifiedForMinimum: qualifiedForMinimum,
    minimumPensionApplied: minimumPensionApplied,
    totalCapitalAccumulated: totalCapital,
    additionalBenefits: additionalBenefits,
    additionalContributions: additionalContributions,
    healthInsurance: healthInsurance,
    valorization: valorization,
    initialCapital: initialCapital,
    zusSubaccount: zusSubaccount
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export constants for testing or external use
export const CALCULATION_CONSTANTS = {
  ZUS_RATES,
  TAX_RATES,
  ADDITIONAL_INSURANCE_RATES,
  DEFAULTS,
  CAPITALIZATION_DEFAULTS,
  CAPS,
  LIFE_TABLE,
  VALIDATION_CONSTRAINTS
};
