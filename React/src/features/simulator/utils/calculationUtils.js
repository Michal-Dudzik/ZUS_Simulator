// ZUS pension calculation utilities

// ZUS contribution rates by employment type (Poland 2024)
export const getZusRates = (employmentType, t) => {
  const rates = {
    employment: {
      totalRate: 0.1952, // 19.52% total
      employeeRate: 0.0976, // 9.76% employee
      employerRate: 0.0976, // 9.76% employer
      description: t('simulator.quick.results.employmentDescription.employment')
    },
    b2b: {
      totalRate: 0.1926, // 19.26% total (self-employed)
      employeeRate: 0.1926, // 19.26% - self-employed pays all
      employerRate: 0, // Self-employed pays everything
      description: t('simulator.quick.results.employmentDescription.b2b')
    },
    'self-employed': {
      totalRate: 0.1926, // 19.26% total
      employeeRate: 0.1926, // Self-employed pays all
      employerRate: 0, // Self-employed pays everything
      description: t('simulator.quick.results.employmentDescription.selfEmployed')
    }
  };
  return rates[employmentType] || rates.employment;
};

// Function to calculate pension based on provided math
export const obliczEmeryture = (zarobkiMiesieczne, lataPracy, waloryzacja, trwanieZyciaMies, kapitalPoczatkowy = 0, employmentType = 'employment', t) => {
  const rates = getZusRates(employmentType, t);
  const skladkaRoczna = zarobkiMiesieczne * 12 * rates.totalRate;

  // suma składek z waloryzacją (ciąg geometryczny)
  const kapital = skladkaRoczna * ((Math.pow(1 + waloryzacja, lataPracy) - 1) / waloryzacja);

  // dodaj kapitał początkowy
  const suma = kapital + kapitalPoczatkowy;

  // wysokość miesięcznej emerytury brutto
  return suma / trwanieZyciaMies;
};

export const calculateYearsOfWork = (values, retirementAge, currentAge) => {
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
  return lataPracy;
};
