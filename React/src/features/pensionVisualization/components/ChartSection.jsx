import React, { useRef } from 'react';
import { Card, Segmented, Switch } from 'antd';
import {
  LineChartOutlined,
  BarChartOutlined,
  DollarOutlined
} from '@ant-design/icons';
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
  buildAccumulationChartData,
  buildPayoutChartData,
  buildComparisonChartData
} from '../utils/chartConfigs';
import './ChartSection.css';

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

const ChartSection = ({
  chartType,
  onChartTypeChange,
  showComparison,
  onShowComparisonChange,
  accumulationData,
  payoutData,
  comparisonData,
  extraYears,
  extraSalary,
  valorization
}) => {
  const chartRef = useRef(null);

  const chartOptions = getBaseChartOptions();
  const comparisonChartOptions = getComparisonChartOptions();

  const accumulationChartData = buildAccumulationChartData(
    accumulationData,
    extraYears,
    extraSalary,
    showComparison
  );

  const payoutChartData = buildPayoutChartData(
    payoutData,
    extraYears,
    extraSalary
  );

  const comparisonChartDataConfig = buildComparisonChartData(comparisonData);

  return (
    <Card className="chart-container-card">
      <div className="chart-header">
        <Segmented
          value={chartType}
          onChange={onChartTypeChange}
          options={[
            {
              label: 'Akumulacja Kapitału',
              value: 'accumulation',
              icon: <LineChartOutlined />
            },
            {
              label: 'Wypłata Emerytury',
              value: 'pension-payout',
              icon: <DollarOutlined />
            },
            {
              label: 'Porównanie',
              value: 'comparison',
              icon: <BarChartOutlined />
            }
          ]}
          size="large"
        />
        
        <div className="chart-options">
          {chartType === 'accumulation' && (
            <div className="option-item">
              <span>Porównaj z przeciętnym:</span>
              <Switch 
                checked={showComparison} 
                onChange={onShowComparisonChange}
              />
            </div>
          )}
        </div>
      </div>

      <div className="chart-wrapper">
        {chartType === 'accumulation' && (
          <>
            <h3>Wzrost Kapitału Emerytalnego w Czasie</h3>
            <p className="chart-description">
              Wykres pokazuje, jak Twój kapitał emerytalny rośnie przez lata pracy dzięki regularnym składkom ZUS i waloryzacji ({(valorization * 100).toFixed(1)}% rocznie).
            </p>
            <div className="chart-canvas">
              <Line ref={chartRef} data={accumulationChartData} options={chartOptions} />
            </div>
          </>
        )}

        {chartType === 'pension-payout' && (
          <>
            <h3>Wypłata Kapitału Emerytalnego</h3>
            <p className="chart-description">
              Wykres pokazuje, jak zgromadzony kapitał będzie wykorzystywany podczas emerytury. Zakładając średnią długość życia na emeryturze: 18 lat.
            </p>
            <div className="chart-canvas">
              <Line data={payoutChartData} options={chartOptions} />
            </div>
          </>
        )}

        {chartType === 'comparison' && (
          <>
            <h3>Porównanie Emerytur</h3>
            <p className="chart-description">
              Porównanie Twojej przewidywanej emerytury z aktualnymi statystykami krajowymi i scenariuszem alternatywnym.
            </p>
            <div className="chart-canvas comparison-chart">
              <Bar data={comparisonChartDataConfig} options={comparisonChartOptions} />
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ChartSection;
