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

/**
 * Build contribution breakdown chart dataset configuration
 */
export const buildContributionBreakdownChartData = (breakdownData) => ({
  labels: breakdownData.years,
  datasets: [
    {
      label: 'Składki ZUS',
      data: breakdownData.zusContributions,
      backgroundColor: 'rgba(17, 120, 59, 0.7)',
      borderColor: '#11783b',
      borderWidth: 2
    },
    {
      label: 'Waloryzacja',
      data: breakdownData.valorization,
      backgroundColor: 'rgba(63, 132, 210, 0.7)',
      borderColor: '#3F84D2',
      borderWidth: 2
    },
    {
      label: 'Kapitał narastająco',
      data: breakdownData.cumulativeCapital,
      type: 'line',
      backgroundColor: 'rgba(255, 179, 79, 0.2)',
      borderColor: '#FFB34F',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      yAxisID: 'y1'
    }
  ]
});

/**
 * Get chart options for contribution breakdown with dual y-axis
 */
export const getContributionBreakdownOptions = () => {
  const baseOptions = getBaseChartOptions();
  
  return {
    ...baseOptions,
    scales: {
      y: {
        beginAtZero: true,
        position: 'left',
        title: {
          display: true,
          text: 'Roczne składki i zyski (PLN)',
          font: { size: 12, weight: 'bold' }
        },
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
      y1: {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: 'Kapitał skumulowany (PLN)',
          font: { size: 12, weight: 'bold' }
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('pl-PL', {
              style: 'currency',
              currency: 'PLN',
              maximumFractionDigits: 0
            }).format(value);
          }
        },
        grid: {
          drawOnChartArea: false
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };
};

/**
 * Build expense forecast chart dataset configuration
 */
export const buildExpenseForecastChartData = (expenseData, extraYears, extraSalary) => ({
  labels: expenseData.years,
  datasets: [
    {
      label: 'Wydatki podstawowe',
      data: expenseData.basicExpenses,
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderColor: '#4BC0C0',
      borderWidth: 2,
      stack: 'expenses'
    },
    {
      label: 'Wydatki medyczne',
      data: expenseData.healthcareExpenses,
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      borderColor: '#FF6384',
      borderWidth: 2,
      stack: 'expenses'
    },
    {
      label: 'Twoja emerytura',
      data: expenseData.pensionIncome,
      type: 'line',
      borderColor: '#11783b',
      backgroundColor: 'rgba(17, 120, 59, 0.2)',
      borderWidth: 3,
      fill: false,
      tension: 0,
      pointRadius: 0
    },
    ...(extraYears > 0 || extraSalary > 0 ? [{
      label: 'Emerytura (scenariusz)',
      data: expenseData.scenarioPensionIncome,
      type: 'line',
      borderColor: '#3F84D2',
      backgroundColor: 'rgba(63, 132, 210, 0.2)',
      borderWidth: 3,
      borderDash: [5, 5],
      fill: false,
      tension: 0,
      pointRadius: 0
    }] : [])
  ]
});

/**
 * Get chart options for expense forecast
 */
export const getExpenseForecastOptions = () => {
  const baseOptions = getBaseChartOptions();
  
  return {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins.legend,
        position: 'top'
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
          },
          footer: function(tooltipItems) {
            if (tooltipItems.length > 0) {
              const index = tooltipItems[0].dataIndex;
              const dataset = tooltipItems[0].chart.data.datasets;
              
              // Calculate total expenses (first two datasets are stacked expenses)
              let totalExpenses = 0;
              if (dataset[0] && dataset[0].data[index]) {
                totalExpenses += dataset[0].data[index];
              }
              if (dataset[1] && dataset[1].data[index]) {
                totalExpenses += dataset[1].data[index];
              }
              
              // Get pension income (third dataset)
              const pensionIncome = dataset[2] && dataset[2].data[index] ? dataset[2].data[index] : 0;
              
              const balance = pensionIncome - totalExpenses;
              const balanceText = balance >= 0 ? 'Nadwyżka' : 'Deficyt';
              
              return `\n${balanceText}: ${new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN',
                maximumFractionDigits: 0
              }).format(Math.abs(balance))}`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: false,
        title: {
          display: true,
          text: 'Miesięczne kwoty (PLN)',
          font: { size: 12, weight: 'bold' }
        },
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
        title: {
          display: true,
          text: 'Wiek',
          font: { size: 12, weight: 'bold' }
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };
};
