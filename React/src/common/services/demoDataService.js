/**
 * Demo Data Generator Service
 * Generates realistic sample data for presentation mode
 */

const EMPLOYMENT_TYPES = ['employment', 'self-employed', 'b2b', 'contract'];
const GENDERS = ['male', 'female'];
const AGE_RANGES = [25, 30, 35, 40, 45, 50, 55, 60];
const INCOME_RANGES = [3500, 5000, 6500, 8000, 10000, 12000, 15000, 18000, 22000];

// Sample postal codes from different Polish voivodeships
const POSTAL_CODES_BY_VOIVODESHIP = {
  'mazowieckie': ['00-001', '01-234', '02-567', '03-890', '04-123', '05-456', '06-789', '07-012', '08-345', '09-678'],
  'wielkopolskie': ['60-001', '61-234', '62-567', '63-890', '64-123'],
  'małopolskie': ['30-001', '31-234', '32-567', '33-890', '34-123'],
  'śląskie': ['40-001', '41-234', '42-567', '43-890', '44-123'],
  'dolnośląskie': ['50-001', '51-234', '52-567', '53-890', '54-123', '55-456', '56-789', '57-012', '58-345', '59-678'],
  'pomorskie': ['80-001', '81-234', '82-567', '83-890', '84-123'],
  'zachodniopomorskie': ['70-001', '71-234', '72-567', '73-890', '74-123', '75-456', '76-789', '77-012', '78-345', '79-678'],
  'łódzkie': ['90-001', '91-234', '92-567', '93-890', '94-123', '95-456', '96-789', '97-012', '98-345', '99-678'],
  'lubelskie': ['20-001', '21-234', '22-567', '23-890', '24-123'],
  'podkarpackie': ['29-001', '35-234', '36-567', '37-890', '38-123', '39-456'],
  'kujawsko-pomorskie': ['85-001', '86-234', '87-567', '88-890', '89-123'],
  'opolskie': ['45-001', '46-234', '47-567', '48-890', '49-123'],
  'lubuskie': ['65-001', '66-234', '67-567', '68-890', '69-123'],
  'warmińsko-mazurskie': ['10-001', '11-234', '12-567', '13-890', '14-123'],
  'podlaskie': ['15-001', '16-234', '17-567', '18-890', '19-123'],
  'świętokrzyskie': ['25-001', '26-234', '27-567', '28-890']
};

// Flatten all postal codes for random selection
const ALL_POSTAL_CODES = Object.values(POSTAL_CODES_BY_VOIVODESHIP).flat();

/**
 * Generate a random date within the last N days
 */
function getRandomDate(daysBack) {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  const date = new Date(now);
  date.setDate(date.getDate() - randomDays);
  return date.toISOString();
}

/**
 * Generate a random value from an array
 */
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random number within a range
 */
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a single realistic simulator usage entry
 */
function generateSingleEntry(timestamp) {
  const gender = randomChoice(GENDERS);
  const currentAge = randomChoice(AGE_RANGES);
  const employmentType = randomChoice(EMPLOYMENT_TYPES);
  const monthlyIncome = randomChoice(INCOME_RANGES) + randomInRange(-500, 500);
  const retirementAge = gender === 'male' ? randomInRange(65, 70) : randomInRange(60, 67);
  const yearsOfWork = retirementAge - currentAge;
  
  // Calculate a realistic pension based on income and years of work
  const yearlyContributions = monthlyIncome * 12 * 0.1976; // ~19.76% ZUS contribution
  const valorization = 1.05; // 5% yearly valorization
  const capitalAccumulated = yearlyContributions * ((Math.pow(valorization, yearsOfWork) - 1) / (valorization - 1));
  const projectedPension = capitalAccumulated / (18 * 12); // 18 years life expectancy
  
  const type = Math.random() > 0.35 ? 'quick' : 'detailed'; // 65% quick, 35% detailed
  
  const entry = {
    id: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: timestamp || getRandomDate(30),
    type,
    monthlyIncome,
    employmentType,
    gender,
    currentAge,
    retirementAge,
    projectedPension,
    yearsOfWork,
    postalCode: Math.random() > 0.2 ? randomChoice(ALL_POSTAL_CODES) : null // 80% have postal code
  };
  
  // Add detailed-specific fields for detailed simulations
  if (type === 'detailed') {
    entry.valorization = 0.05 + (Math.random() * 0.03 - 0.015); // 3.5% - 6.5%
    entry.initialCapital = Math.random() > 0.7 ? randomInRange(5000, 50000) : 0;
    const benefits = [];
    if (Math.random() > 0.5) benefits.push('disability');
    if (Math.random() > 0.6) benefits.push('sickness');
    if (Math.random() > 0.7) benefits.push('accident');
    entry.additionalBenefits = benefits.join(',');
  }
  
  return entry;
}

/**
 * Generate demo analytics data with realistic distribution
 */
export function generateDemoData(count = 150) {
  const entries = [];
  const now = new Date();
  
  // Generate entries with realistic daily distribution
  for (let i = 0; i < count; i++) {
    // Create more entries for recent days (simulate growing usage)
    const daysBack = Math.floor(Math.pow(Math.random(), 2) * 30); // Skew towards recent days
    const date = new Date(now);
    date.setDate(date.getDate() - daysBack);
    
    // Add some randomness to the time of day
    date.setHours(randomInRange(8, 22));
    date.setMinutes(randomInRange(0, 59));
    
    entries.push(generateSingleEntry(date.toISOString()));
  }
  
  // Sort by timestamp (oldest first)
  entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return entries;
}

/**
 * Generate demo data with specific patterns for showcase
 */
export function generateShowcaseData() {
  const entries = [];
  const now = new Date();
  
  // Create a nice growth pattern over 30 days
  const dailyDistribution = [
    2, 2, 3, 3, 4, 5, 5, 6, 7, 8,  // Days 1-10: Slow start
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17,  // Days 11-20: Steady growth
    18, 19, 20, 22, 24, 26, 28, 30, 32, 35   // Days 21-30: Accelerated growth
  ];
  
  dailyDistribution.forEach((count, dayIndex) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (29 - dayIndex)); // Start from 30 days ago
    
    for (let i = 0; i < count; i++) {
      // Spread entries throughout the day
      const entryDate = new Date(date);
      entryDate.setHours(randomInRange(8, 22));
      entryDate.setMinutes(randomInRange(0, 59));
      
      entries.push(generateSingleEntry(entryDate.toISOString()));
    }
  });
  
  // Sort by timestamp
  entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return entries;
}

/**
 * Generate focused demo data emphasizing specific demographics
 */
export function generateFocusedDemoData(focus = 'balanced') {
  const entries = [];
  let count = 200;
  
  switch (focus) {
    case 'young':
      // Focus on younger demographics
      count = 180;
      for (let i = 0; i < count; i++) {
        const entry = generateSingleEntry(getRandomDate(30));
        entry.currentAge = randomChoice([25, 28, 30, 32, 35, 38, 40]);
        entries.push(entry);
      }
      break;
      
    case 'diverse':
      // Very diverse income and employment types
      count = 220;
      for (let i = 0; i < count; i++) {
        const entry = generateSingleEntry(getRandomDate(30));
        // Ensure all employment types are well represented
        entry.employmentType = EMPLOYMENT_TYPES[i % EMPLOYMENT_TYPES.length];
        entries.push(entry);
      }
      break;
      
    case 'balanced':
    default:
      // Well-balanced across all demographics
      return generateShowcaseData();
  }
  
  return entries;
}

/**
 * Get summary statistics for demo data
 */
export function getDemoSummary(entries) {
  if (!entries || entries.length === 0) {
    return null;
  }
  
  const summary = {
    totalUsages: entries.length,
    genderDistribution: {},
    employmentTypeDistribution: {},
    ageRangeDistribution: {},
    incomeRangeDistribution: {},
    usageByDay: {},
    usageByType: { quick: 0, detailed: 0 },
    retirementAgeByGender: { male: [], female: [] },
    postalCodeDistribution: {}
  };
  
  let totalIncome = 0;
  let totalRetirementAge = 0;
  let totalPension = 0;
  
  entries.forEach(entry => {
    // Gender
    if (entry.gender) {
      summary.genderDistribution[entry.gender] = (summary.genderDistribution[entry.gender] || 0) + 1;
      if (entry.retirementAge) {
        summary.retirementAgeByGender[entry.gender].push(entry.retirementAge);
      }
    }
    
    // Employment
    if (entry.employmentType) {
      summary.employmentTypeDistribution[entry.employmentType] = 
        (summary.employmentTypeDistribution[entry.employmentType] || 0) + 1;
    }
    
    // Age range
    if (entry.currentAge) {
      const ageRange = getAgeRange(entry.currentAge);
      summary.ageRangeDistribution[ageRange] = (summary.ageRangeDistribution[ageRange] || 0) + 1;
    }
    
    // Income range
    if (entry.monthlyIncome) {
      const incomeRange = getIncomeRange(entry.monthlyIncome);
      summary.incomeRangeDistribution[incomeRange] = (summary.incomeRangeDistribution[incomeRange] || 0) + 1;
      totalIncome += entry.monthlyIncome;
    }
    
    // Retirement age
    if (entry.retirementAge) {
      totalRetirementAge += entry.retirementAge;
    }
    
    // Pension
    if (entry.projectedPension) {
      totalPension += entry.projectedPension;
    }
    
    // Usage by day
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    summary.usageByDay[date] = (summary.usageByDay[date] || 0) + 1;
    
    // Usage by type
    if (entry.type) {
      summary.usageByType[entry.type] = (summary.usageByType[entry.type] || 0) + 1;
    }
    
    // Postal code
    if (entry.postalCode) {
      summary.postalCodeDistribution[entry.postalCode] = (summary.postalCodeDistribution[entry.postalCode] || 0) + 1;
    }
  });
  
  summary.averageMonthlyIncome = totalIncome / entries.length;
  summary.averageRetirementAge = totalRetirementAge / entries.length;
  summary.averageProjectedPension = totalPension / entries.length;
  
  summary.retirementAgeByGender = {
    male: summary.retirementAgeByGender.male.length > 0
      ? summary.retirementAgeByGender.male.reduce((a, b) => a + b, 0) / summary.retirementAgeByGender.male.length
      : 0,
    female: summary.retirementAgeByGender.female.length > 0
      ? summary.retirementAgeByGender.female.reduce((a, b) => a + b, 0) / summary.retirementAgeByGender.female.length
      : 0
  };
  
  return summary;
}

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
