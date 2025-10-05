import React from 'react';
import { Card } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  getBaseChartOptions,
  getComparisonChartOptions,
  getContributionBreakdownOptions,
  buildAccumulationChartData,
  buildPayoutChartData,
  buildComparisonChartData,
  buildContributionBreakdownChartData
} from '../utils/chartConfigs';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const AllChartsForPrint = ({
  accumulationData,
  payoutData,
  comparisonData,
  contributionBreakdownData,
  valorization
}) => {
  const chartOptions = getBaseChartOptions();
  const comparisonChartOptions = getComparisonChartOptions();
  const breakdownChartOptions = getContributionBreakdownOptions();

  const accumulationChartData = buildAccumulationChartData(
    accumulationData,
    0,
    0,
    true // show comparison
  );

  const payoutChartData = buildPayoutChartData(
    payoutData,
    0,
    0
  );

  const comparisonChartDataConfig = buildComparisonChartData(comparisonData);
  
  const breakdownChartData = buildContributionBreakdownChartData(contributionBreakdownData);

  return (
    <div className="all-charts-print-only">
      {/* Chart 1: Accumulation */}
      <Card className="chart-container-card" style={{ marginBottom: '20px' }}>
        <div className="chart-wrapper">
          <h3>Wzrost Kapitału Emerytalnego w Czasie</h3>
          <p className="chart-description">
            Wykres pokazuje, jak Twój kapitał emerytalny rośnie przez lata pracy dzięki regularnym składkom ZUS i waloryzacji ({(valorization * 100).toFixed(1)}% rocznie).
          </p>
          <div className="chart-canvas">
            <Line data={accumulationChartData} options={chartOptions} />
          </div>
        </div>
      </Card>

      {/* Chart 2: Payout */}
      <Card className="chart-container-card" style={{ marginBottom: '20px' }}>
        <div className="chart-wrapper">
          <h3>Wypłata Kapitału Emerytalnego</h3>
          <p className="chart-description">
            Wykres pokazuje, jak zgromadzony kapitał będzie wykorzystywany podczas emerytury. Zakładając średnią długość życia na emeryturze: 18 lat.
          </p>
          <div className="chart-canvas">
            <Line data={payoutChartData} options={chartOptions} />
          </div>
        </div>
      </Card>

      {/* Chart 3: Comparison */}
      <Card className="chart-container-card" style={{ marginBottom: '20px' }}>
        <div className="chart-wrapper">
          <h3>Porównanie Emerytur</h3>
          <p className="chart-description">
            Porównanie Twojej przewidywanej emerytury z aktualnymi statystykami krajowymi i scenariuszem alternatywnym.
          </p>
          <div className="chart-canvas comparison-chart">
            <Bar data={comparisonChartDataConfig} options={comparisonChartOptions} />
          </div>
        </div>
      </Card>

      {/* Chart 4: Breakdown */}
      <Card className="chart-container-card" style={{ marginBottom: '20px' }}>
        <div className="chart-wrapper">
          <h3>Struktura Składek i Wzrostu Kapitału</h3>
          <p className="chart-description">
            Wykres pokazuje jak Twoje roczne składki ZUS oraz zyski z waloryzacji ({(valorization * 100).toFixed(1)}% rocznie) składają się na całkowity kapitał emerytalny.
          </p>
          <div className="chart-canvas">
            <Bar data={breakdownChartData} options={breakdownChartOptions} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AllChartsForPrint;
