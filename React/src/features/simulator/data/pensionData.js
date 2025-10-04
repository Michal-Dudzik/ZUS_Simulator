// Current Polish pension statistics (2024 data)
export const pensionData = {
  currentAverage: 2100, // PLN - current average pension in Poland
  minimumPension: 1200, // PLN - minimum guaranteed pension
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
