/**
 * Common chart options configuration
 */
export const getBaseChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        padding: 15,
        font: { size: 12 },
        usePointStyle: true
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('pl-PL', {
              style: 'currency',
              currency: 'PLN',
              maximumFractionDigits: 0
            }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
            maximumFractionDigits: 0
          }).format(value);
        }
      }
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45
      }
    }
  }
});

/**
 * Comparison chart options (horizontal bar chart)
 */
export const getComparisonChartOptions = () => {
  const baseOptions = getBaseChartOptions();
  
  return {
    ...baseOptions,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('pl-PL', {
              style: 'currency',
              currency: 'PLN',
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      }
    }
  };
};

/**
 * Build accumulation chart dataset configuration
 */
export const buildAccumulationChartData = (
  accumulationData,
  extraYears,
  extraSalary,
  showComparison
) => ({
  labels: accumulationData.years,
  datasets: [
    {
      label: 'Twój kapitał emerytalny',
      data: accumulationData.baseCapital,
      borderColor: '#11783b',
      backgroundColor: 'rgba(17, 120, 59, 0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 3
    },
    ...(extraYears > 0 || extraSalary > 0 ? [{
      label: `Scenariusz (+${extraYears} lat, +${extraSalary}% wynagrodzenia)`,
      data: accumulationData.scenarioCapital,
      borderColor: '#3F84D2',
      backgroundColor: 'rgba(63, 132, 210, 0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 3,
      borderDash: [5, 5]
    }] : []),
    ...(showComparison ? [{
      label: 'Przeciętny Polak',
      data: accumulationData.averageCapital,
      borderColor: '#FFB34F',
      backgroundColor: 'rgba(255, 179, 79, 0.1)',
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
      borderDash: [3, 3]
    }] : [])
  ]
});

/**
 * Build payout chart dataset configuration
 */
export const buildPayoutChartData = (payoutData, extraYears, extraSalary) => ({
  labels: payoutData.years,
  datasets: [
    {
      label: 'Pozostały kapitał (bazowy)',
      data: payoutData.remainingCapital,
      borderColor: '#11783b',
      backgroundColor: 'rgba(17, 120, 59, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 3
    },
    ...(extraYears > 0 || extraSalary > 0 ? [{
      label: 'Pozostały kapitał (scenariusz)',
      data: payoutData.scenarioRemainingCapital,
      borderColor: '#3F84D2',
      backgroundColor: 'rgba(63, 132, 210, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 3,
      borderDash: [5, 5]
    }] : [])
  ]
});

/**
 * Build comparison chart dataset configuration
 */
export const buildComparisonChartData = (comparisonData) => ({
  labels: comparisonData.labels,
  datasets: [{
    label: 'Emerytura miesięczna (PLN)',
    data: comparisonData.values,
    backgroundColor: comparisonData.colors,
    borderColor: comparisonData.colors.map(c => c),
    borderWidth: 2
  }]
});
