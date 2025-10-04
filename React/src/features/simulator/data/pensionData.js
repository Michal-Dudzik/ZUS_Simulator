// Current Polish pension statistics (2024 data)
export const pensionData = {
  currentAverage: 2100, // PLN - current average pension in Poland
  minimumPension: 1878.91, // PLN - minimum guaranteed pension (Poland 2024)
  minimumWorkingYearsMen: 25, // Minimum years for men to qualify for minimum pension
  minimumWorkingYearsWomen: 20, // Minimum years for women to qualify for minimum pension
  minimumRetirementAgeMen: 65, // Minimum retirement age for men
  minimumRetirementAgeWomen: 60, // Minimum retirement age for women
  pensionGroups: [
    {
      id: 'belowMinimum',
      title: 'belowMinimum',
      range: { min: 0, max: 1200 },
      percentage: 15, // Percentage of pensioners in this group
      color: '#ff4d4f',
      description: 'belowMinimum'
    },
    {
      id: 'aroundAverage', 
      title: 'aroundAverage',
      range: { min: 1200, max: 3000 },
      percentage: 65, // Majority of pensioners
      color: '#1890ff',
      description: 'aroundAverage'
    },
    {
      id: 'aboveAverage',
      title: 'aboveAverage', 
      range: { min: 3000, max: 10000 },
      percentage: 20, // Higher earners
      color: '#52c41a',
      description: 'aboveAverage'
    }
  ],
  statistics: {
    totalPensioners: 5600000, // Total number of pensioners in Poland
    averageAge: 67, // Average retirement age
    lifeExpectancy: 78, // Life expectancy at retirement
    replacementRate: 0.45 // Average replacement rate (pension vs last salary)
  }
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function to get pension group by amount
export const getPensionGroup = (amount) => {
  return pensionData.pensionGroups.find(group => 
    amount >= group.range.min && amount < group.range.max
  ) || pensionData.pensionGroups[pensionData.pensionGroups.length - 1];
};

// Helper function to check if user qualifies for minimum pension
export const qualifiesForMinimumPension = (yearsOfWork, gender) => {
  const minYearsRequired = gender === 'female' 
    ? pensionData.minimumWorkingYearsWomen 
    : pensionData.minimumWorkingYearsMen;
  
  return yearsOfWork >= minYearsRequired;
};

// Helper function to calculate final pension with minimum pension rules applied
export const calculateFinalPension = (calculatedPension, yearsOfWork, gender) => {
  const qualified = qualifiesForMinimumPension(yearsOfWork, gender);
  
  if (!qualified) {
    return calculatedPension; // Return calculated amount if not qualified for minimum
  }
  
  return Math.max(calculatedPension, pensionData.minimumPension);
};
