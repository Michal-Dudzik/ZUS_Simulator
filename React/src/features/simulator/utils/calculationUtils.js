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

export const calculateYearsOfWork = (values, retirementAge, currentAge) => {
  if (values.workStartDate) {
    const startDate = new Date(values.workStartDate);
    // If birth date is available, use it for precise calculation
    if (values.birthDate) {
      const birthDate = new Date(values.birthDate);
      const workStartAge = startDate.getFullYear() - birthDate.getFullYear() - 
        (startDate < new Date(startDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);
      return retirementAge - workStartAge;
    } else {
      // Fallback: estimate work start age from current age and years since workStartDate
      const yearsSinceStart = new Date().getFullYear() - startDate.getFullYear();
      const workStartAge = currentAge - yearsSinceStart;
      return retirementAge - workStartAge;
    }
  } else {
    return retirementAge - currentAge;
  }
};

// Function to calculate pension based on provided math
export const obliczEmeryture = (
  zarobkiMiesieczne,
  lataPracy,
  waloryzacja,
  trwanieZyciaMies,
  kapitalPoczatkowy = 0,
  employmentType = 'employment',
  t
) => {
  const rates = getZusRates(employmentType, t);
  const skladkaRoczna = zarobkiMiesieczne * 12 * rates.totalRate;

  // Accumulate contributions with annual valorization
  let sumaKapitalu = kapitalPoczatkowy;
  for (let i = 0; i < lataPracy; i++) {
    sumaKapitalu = (sumaKapitalu + skladkaRoczna) * (1 + waloryzacja);
  }

  // Calculate monthly pension
  return sumaKapitalu / trwanieZyciaMies;
};
