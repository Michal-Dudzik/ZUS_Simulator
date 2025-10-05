/**
 * Analytics Service for tracking simulator usage
 * Stores data in localStorage for now, can be extended to use Supabase or backend
 */

const STORAGE_KEY = 'zus_simulator_analytics';
const MAX_ENTRIES = 10000; // Limit storage size

/**
 * Get all analytics data
 */
export const getAnalyticsData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to retrieve analytics data:', error);
    return [];
  }
};

/**
 * Track simulator usage
 * @param {Object} usageData - Data about the simulation
 */
export const trackSimulatorUsage = (usageData) => {
  try {
    const existingData = getAnalyticsData();
    
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: usageData.type || 'quick', // 'quick' or 'detailed'
      ...usageData
    };

    // Add new entry at the beginning
    const newData = [entry, ...existingData];

    // Limit the number of entries to prevent storage overflow
    const trimmedData = newData.slice(0, MAX_ENTRIES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedData));
    
    return entry;
  } catch (error) {
    console.error('Failed to track simulator usage:', error);
    return null;
  }
};

/**
 * Get analytics summary statistics
 */
export const getAnalyticsSummary = () => {
  const data = getAnalyticsData();
  
  if (data.length === 0) {
    return {
      totalUsages: 0,
      genderDistribution: {},
      employmentTypeDistribution: {},
      ageRangeDistribution: {},
      incomeRangeDistribution: {},
      averageMonthlyIncome: 0,
      averageRetirementAge: 0,
      averageProjectedPension: 0,
      usageByDay: {},
      usageByType: {},
      retirementAgeByGender: {}
    };
  }

  // Calculate distributions
  const genderDistribution = {};
  const employmentTypeDistribution = {};
  const ageRangeDistribution = {};
  const incomeRangeDistribution = {};
  const usageByDay = {};
  const usageByType = { quick: 0, detailed: 0 };
  const retirementAgeByGender = { male: [], female: [] };

  let totalIncome = 0;
  let totalRetirementAge = 0;
  let totalProjectedPension = 0;
  let incomeCount = 0;
  let retirementAgeCount = 0;
  let pensionCount = 0;

  data.forEach(entry => {
    // Gender distribution
    if (entry.gender) {
      genderDistribution[entry.gender] = (genderDistribution[entry.gender] || 0) + 1;
    }

    // Employment type distribution
    if (entry.employmentType) {
      employmentTypeDistribution[entry.employmentType] = (employmentTypeDistribution[entry.employmentType] || 0) + 1;
    }

    // Age range distribution
    if (entry.currentAge) {
      const ageRange = getAgeRange(entry.currentAge);
      ageRangeDistribution[ageRange] = (ageRangeDistribution[ageRange] || 0) + 1;
    }

    // Income range distribution
    if (entry.monthlyIncome) {
      const incomeRange = getIncomeRange(entry.monthlyIncome);
      incomeRangeDistribution[incomeRange] = (incomeRangeDistribution[incomeRange] || 0) + 1;
      totalIncome += entry.monthlyIncome;
      incomeCount++;
    }

    // Average retirement age
    if (entry.retirementAge) {
      totalRetirementAge += entry.retirementAge;
      retirementAgeCount++;
      if (entry.gender && (entry.gender === 'male' || entry.gender === 'female')) {
        retirementAgeByGender[entry.gender].push(entry.retirementAge);
      }
    }

    // Average projected pension
    if (entry.projectedPension) {
      totalProjectedPension += entry.projectedPension;
      pensionCount++;
    }

    // Usage by day (last 30 days)
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    usageByDay[date] = (usageByDay[date] || 0) + 1;

    // Usage by type
    if (entry.type) {
      usageByType[entry.type] = (usageByType[entry.type] || 0) + 1;
    }
  });

  // Postal code distribution
  const postalCodeDistribution = {};
  data.forEach(entry => {
    if (entry.postalCode) {
      postalCodeDistribution[entry.postalCode] = (postalCodeDistribution[entry.postalCode] || 0) + 1;
    }
  });

  return {
    totalUsages: data.length,
    genderDistribution,
    employmentTypeDistribution,
    ageRangeDistribution,
    incomeRangeDistribution,
    averageMonthlyIncome: incomeCount > 0 ? totalIncome / incomeCount : 0,
    averageRetirementAge: retirementAgeCount > 0 ? totalRetirementAge / retirementAgeCount : 0,
    averageProjectedPension: pensionCount > 0 ? totalProjectedPension / pensionCount : 0,
    usageByDay,
    usageByType,
    retirementAgeByGender: {
      male: retirementAgeByGender.male.length > 0 ? 
        retirementAgeByGender.male.reduce((a, b) => a + b, 0) / retirementAgeByGender.male.length : 0,
      female: retirementAgeByGender.female.length > 0 ? 
        retirementAgeByGender.female.reduce((a, b) => a + b, 0) / retirementAgeByGender.female.length : 0
    },
    postalCodeDistribution
  };
};

/**
 * Get usage trends over time (last N days)
 */
export const getUsageTrends = (days = 30) => {
  const data = getAnalyticsData();
  const now = new Date();
  const trends = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = data.filter(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate === dateStr;
    }).length;

    trends.push({
      date: dateStr,
      count
    });
  }

  return trends;
};

/**
 * Clear all analytics data
 */
export const clearAnalyticsData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear analytics data:', error);
    return false;
  }
};

/**
 * Export analytics data as JSON
 */
export const exportAnalyticsData = () => {
  const data = getAnalyticsData();
  const summary = getAnalyticsSummary();
  
  return {
    exportDate: new Date().toISOString(),
    summary,
    rawData: data
  };
};

// Helper functions

function getAgeRange(age) {
  if (age < 25) return '< 25';
  if (age < 35) return '25-34';
  if (age < 45) return '35-44';
  if (age < 55) return '45-54';
  if (age < 65) return '55-64';
  return '65+';
}

function getIncomeRange(income) {
  if (income < 3000) return '< 3000 PLN';
  if (income < 5000) return '3000-5000 PLN';
  if (income < 7000) return '5000-7000 PLN';
  if (income < 10000) return '7000-10000 PLN';
  if (income < 15000) return '10000-15000 PLN';
  return '15000+ PLN';
}

/**
 * Get location-based analytics by voivodeship
 */
export const getLocationMetrics = () => {
  const data = getAnalyticsData();
  
  if (data.length === 0) {
    return {
      byVoivodeship: {},
      totalWithLocation: 0,
      totalWithoutLocation: 0
    };
  }

  const byVoivodeship = {};
  let totalWithLocation = 0;
  let totalWithoutLocation = 0;

  data.forEach(entry => {
    if (entry.postalCode) {
      const voivodeship = getVoivodeshipFromPostalCode(entry.postalCode);
      
      if (voivodeship) {
        if (!byVoivodeship[voivodeship]) {
          byVoivodeship[voivodeship] = {
            count: 0,
            totalIncome: 0,
            totalPension: 0,
            totalAge: 0,
            genderCount: { male: 0, female: 0 },
            employmentTypes: {}
          };
        }

        byVoivodeship[voivodeship].count++;
        
        if (entry.monthlyIncome) {
          byVoivodeship[voivodeship].totalIncome += entry.monthlyIncome;
        }
        
        if (entry.projectedPension) {
          byVoivodeship[voivodeship].totalPension += entry.projectedPension;
        }
        
        if (entry.currentAge) {
          byVoivodeship[voivodeship].totalAge += entry.currentAge;
        }
        
        if (entry.gender) {
          byVoivodeship[voivodeship].genderCount[entry.gender] = 
            (byVoivodeship[voivodeship].genderCount[entry.gender] || 0) + 1;
        }
        
        if (entry.employmentType) {
          byVoivodeship[voivodeship].employmentTypes[entry.employmentType] = 
            (byVoivodeship[voivodeship].employmentTypes[entry.employmentType] || 0) + 1;
        }

        totalWithLocation++;
      }
    } else {
      totalWithoutLocation++;
    }
  });

  // Calculate averages
  Object.keys(byVoivodeship).forEach(voivodeship => {
    const stats = byVoivodeship[voivodeship];
    stats.avgIncome = stats.count > 0 ? stats.totalIncome / stats.count : 0;
    stats.avgPension = stats.count > 0 ? stats.totalPension / stats.count : 0;
    stats.avgAge = stats.count > 0 ? stats.totalAge / stats.count : 0;
  });

  return {
    byVoivodeship,
    totalWithLocation,
    totalWithoutLocation
  };
};

/**
 * Map postal code to voivodeship (województwo)
 */
function getVoivodeshipFromPostalCode(postalCode) {
  if (!postalCode) return null;
  
  // Remove any non-digit characters and get first 2 digits
  const code = postalCode.replace(/\D/g, '').substring(0, 2);
  const numCode = parseInt(code, 10);
  
  // Polish postal code to voivodeship mapping
  // Format: XX-XXX where XX is the key prefix
  if (numCode >= 0 && numCode <= 9) return 'mazowieckie';
  if (numCode >= 10 && numCode <= 19) return 'warmińsko-mazurskie';
  if (numCode >= 15 && numCode <= 19) return 'podlaskie';
  if (numCode >= 20 && numCode <= 24) return 'lubelskie';
  if (numCode >= 25 && numCode <= 28) return 'świętokrzyskie';
  if (numCode >= 29 && numCode <= 29) return 'podkarpackie';
  if (numCode >= 30 && numCode <= 34) return 'małopolskie';
  if (numCode >= 35 && numCode <= 39) return 'podkarpackie';
  if (numCode >= 40 && numCode <= 47) return 'śląskie';
  if (numCode >= 48 && numCode <= 49) return 'opolskie';
  if (numCode >= 50 && numCode <= 59) return 'dolnośląskie';
  if (numCode >= 60 && numCode <= 64) return 'wielkopolskie';
  if (numCode >= 65 && numCode <= 69) return 'lubuskie';
  if (numCode >= 70 && numCode <= 74) return 'zachodniopomorskie';
  if (numCode >= 75 && numCode <= 79) return 'zachodniopomorskie';
  if (numCode >= 80 && numCode <= 84) return 'pomorskie';
  if (numCode >= 85 && numCode <= 89) return 'kujawsko-pomorskie';
  if (numCode >= 90 && numCode <= 99) return 'łódzkie';
  
  return null;
}
