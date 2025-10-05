import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Statistic, Card, Alert, Button, Space, Empty, Spin, Tag } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  CalculatorOutlined, 
  LineChartOutlined,
  ReloadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import PageLayout from '../components/PageLayout';
import { 
  getAnalyticsSummary, 
  getUsageTrends, 
  clearAnalyticsData, 
  exportAnalyticsData,
  getAnalyticsData
} from '../../../common/services/analyticsService';
import { generateShowcaseData, getDemoSummary } from '../../../common/services/demoDataService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const { Title: AntTitle, Text } = Typography;

const PRESENTATION_MODE_KEY = 'admin_presentation_mode';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRawData, setCurrentRawData] = useState([]);
  const [isPresentationMode, setIsPresentationMode] = useState(() => {
    return localStorage.getItem(PRESENTATION_MODE_KEY) === 'true';
  });

  const loadData = () => {
    setLoading(true);
    try {
      const presentationMode = localStorage.getItem(PRESENTATION_MODE_KEY) === 'true';
      
      if (presentationMode) {
        // Use demo data in presentation mode
        const demoData = generateShowcaseData();
        const demoSummary = getDemoSummary(demoData);
        setSummary(demoSummary);
        setCurrentRawData(demoData);
        
        // Generate trends from demo data
        const trendMap = demoSummary.usageByDay;
        const trendArray = Object.entries(trendMap)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-30) // Last 30 days
          .map(([date, count]) => ({ date, count }));
        setTrends(trendArray);
      } else {
        // Use real analytics data
        const analyticsSummary = getAnalyticsSummary();
        const usageTrends = getUsageTrends(30);
        const rawData = getAnalyticsData();
        setSummary(analyticsSummary);
        setTrends(usageTrends);
        setCurrentRawData(rawData);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Listen for presentation mode changes
    const handlePresentationModeChange = (event) => {
      setIsPresentationMode(event.detail.enabled);
      loadData();
    };
    
    window.addEventListener('presentationModeChange', handlePresentationModeChange);
    return () => {
      window.removeEventListener('presentationModeChange', handlePresentationModeChange);
    };
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  const handleExport = () => {
    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Sheet 1: Summary Statistics
      const summaryData = [
        ['Metric', 'Value'],
        ['Total Simulations', summary.totalUsages],
        ['Average Monthly Income (PLN)', summary.averageMonthlyIncome.toFixed(2)],
        ['Average Retirement Age', summary.averageRetirementAge.toFixed(2)],
        ['Average Projected Pension (PLN)', summary.averageProjectedPension.toFixed(2)],
        ['Average Retirement Age (Male)', summary.retirementAgeByGender.male.toFixed(2)],
        ['Average Retirement Age (Female)', summary.retirementAgeByGender.female.toFixed(2)],
        [],
        ['Gender Distribution', 'Count'],
        ...Object.entries(summary.genderDistribution).map(([key, value]) => [
          t(`simulator.form.gender.${key}`) || key, 
          value
        ]),
        [],
        ['Employment Type', 'Count'],
        ...Object.entries(summary.employmentTypeDistribution).map(([key, value]) => [
          t(`simulator.form.employmentType.${key}`) || key, 
          value
        ]),
        [],
        ['Age Range', 'Count'],
        ...Object.entries(summary.ageRangeDistribution).map(([key, value]) => [key, value]),
        [],
        ['Income Range', 'Count'],
        ...Object.entries(summary.incomeRangeDistribution).map(([key, value]) => [key, value]),
        [],
        ['Simulation Type', 'Count'],
        ['Quick', summary.usageByType.quick || 0],
        ['Detailed', summary.usageByType.detailed || 0],
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
      
      // Sheet 2: Raw Data
      const rawDataForExcel = currentRawData.map(entry => ({
        'ID': entry.id,
        'Timestamp': entry.timestamp,
        'Type': entry.type,
        'Gender': entry.gender ? (t(`simulator.form.gender.${entry.gender}`) || entry.gender) : '',
        'Current Age': entry.currentAge || '',
        'Retirement Age': entry.retirementAge || '',
        'Years of Work': entry.yearsOfWork || '',
        'Employment Type': entry.employmentType ? (t(`simulator.form.employmentType.${entry.employmentType}`) || entry.employmentType) : '',
        'Monthly Income (PLN)': entry.monthlyIncome || '',
        'Projected Pension (PLN)': entry.projectedPension ? entry.projectedPension.toFixed(2) : '',
        'Postal Code': entry.postalCode || '',
        'Valorization': entry.valorization || '',
        'Initial Capital': entry.initialCapital || '',
        'Additional Benefits': entry.additionalBenefits || ''
      }));
      const wsRawData = XLSX.utils.json_to_sheet(rawDataForExcel);
      XLSX.utils.book_append_sheet(wb, wsRawData, 'Raw Data');
      
      // Sheet 3: Daily Usage Trends
      const trendsData = [
        ['Date', 'Usage Count'],
        ...trends.map(t => [t.date, t.count])
      ];
      const wsTrends = XLSX.utils.aoa_to_sheet(trendsData);
      XLSX.utils.book_append_sheet(wb, wsTrends, 'Daily Trends');
      
      // Generate filename
      const dateStr = new Date().toISOString().split('T')[0];
      const modePrefix = isPresentationMode ? 'demo' : 'real';
      const filename = `simulator-analytics-${modePrefix}-${dateStr}.xlsx`;
      
      // Write the file
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert(t('admin.dashboard.exportError') || 'Failed to export data. Please try again.');
    }
  };

  const handleClearData = () => {
    if (window.confirm(t('admin.dashboard.confirmClear') || 'Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAnalyticsData();
      loadData();
    }
  };

  if (loading) {
    return (
      <PageLayout icon={DashboardOutlined} title={t('admin.dashboard.title')}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </PageLayout>
    );
  }

  if (!summary || summary.totalUsages === 0) {
    return (
      <PageLayout icon={DashboardOutlined} title={t('admin.dashboard.title')}>
        <Empty
          description={t('admin.dashboard.noData') || 'No simulator usage data available yet'}
          style={{ padding: '50px' }}
        >
          <Text type="secondary">
            {t('admin.dashboard.noDataDescription') || 'Start using the simulator to see analytics here'}
          </Text>
        </Empty>
      </PageLayout>
    );
  }

  // Prepare chart data
  const genderLabels = Object.keys(summary.genderDistribution).map(key => 
    t(`simulator.form.gender.${key}`) || key
  );
  const genderData = {
    labels: genderLabels,
    datasets: [{
      label: t('admin.dashboard.genderDistribution') || 'Gender Distribution',
      data: Object.values(summary.genderDistribution),
      backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
      borderWidth: 1
    }]
  };

  const employmentLabels = Object.keys(summary.employmentTypeDistribution).map(key => 
    t(`simulator.form.employmentType.${key}`) || key
  );
  const employmentData = {
    labels: employmentLabels,
    datasets: [{
      label: t('admin.dashboard.employmentDistribution') || 'Employment Type Distribution',
      data: Object.values(summary.employmentTypeDistribution),
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 205, 86, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 205, 86, 1)'
      ],
      borderWidth: 1
    }]
  };

  const ageRangeData = {
    labels: Object.keys(summary.ageRangeDistribution),
    datasets: [{
      label: t('admin.dashboard.ageDistribution') || 'Age Distribution',
      data: Object.values(summary.ageRangeDistribution),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const incomeRangeData = {
    labels: Object.keys(summary.incomeRangeDistribution),
    datasets: [{
      label: t('admin.dashboard.incomeDistribution') || 'Income Distribution',
      data: Object.values(summary.incomeRangeDistribution),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const usageTrendsData = {
    labels: trends.map(t => t.date),
    datasets: [{
      label: t('admin.dashboard.dailyUsage') || 'Daily Usage',
      data: trends.map(t => t.count),
      fill: true,
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
      tension: 0.4
    }]
  };

  const simulatorTypeData = {
    labels: [
      t('admin.dashboard.quickSimulations') || 'Quick',
      t('admin.dashboard.detailedSimulations') || 'Detailed'
    ],
    datasets: [{
      data: [summary.usageByType.quick || 0, summary.usageByType.detailed || 0],
      backgroundColor: ['rgba(255, 205, 86, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      borderColor: ['rgba(255, 205, 86, 1)', 'rgba(153, 102, 255, 1)'],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 10,
          font: {
            size: 11
          }
        }
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: 10
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  // Calculate additional metrics
  const avgYearsUntilRetirement = summary.averageRetirementAge - (summary.totalUsages > 0 ? 
    Object.entries(summary.ageRangeDistribution).reduce((acc, [range, count]) => {
      const avgAge = range.includes('+') ? 55 : 
        (parseInt(range.split('-')[0]) + parseInt(range.split('-')[1])) / 2;
      return acc + (avgAge * count);
    }, 0) / summary.totalUsages : 0);

  const pensionToIncomeRatio = summary.averageMonthlyIncome > 0 ? 
    (summary.averageProjectedPension / summary.averageMonthlyIncome * 100).toFixed(1) : 0;

  // Calculate weekly average from trends
  const weeklyAverage = trends.length >= 7 ? 
    (trends.slice(-7).reduce((sum, t) => sum + t.count, 0) / 7).toFixed(1) : 0;

  // Find most active day of week from trends
  const dayOfWeekCounts = trends.reduce((acc, t) => {
    const dayOfWeek = new Date(t.date).toLocaleDateString('en-US', { weekday: 'long' });
    acc[dayOfWeek] = (acc[dayOfWeek] || 0) + t.count;
    return acc;
  }, {});
  const mostActiveDay = Object.keys(dayOfWeekCounts).length > 0 ? 
    Object.entries(dayOfWeekCounts).sort((a, b) => b[1] - a[1])[0][0] : 'N/A';

  return (
    <PageLayout 
      icon={DashboardOutlined}
      title={t('admin.dashboard.title')}
      cardClassName="dashboard-page-card"
    >
      {/* Presentation Mode Indicator & Action Buttons */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          {isPresentationMode && (
            <Tag icon={<ExperimentOutlined />} color="orange" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {t('admin.presentationModeActive') || 'Presentation Mode - Demo Data'}
            </Tag>
          )}
        </div>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            {t('admin.dashboard.refresh') || 'Refresh'}
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            {t('admin.dashboard.export') || 'Export Data'}
          </Button>
          {!isPresentationMode && (
            <Button danger icon={<DeleteOutlined />} onClick={handleClearData}>
              {t('admin.dashboard.clearData') || 'Clear Data'}
            </Button>
          )}
        </Space>
      </div>

      {/* Key Metrics */}
      <div style={{ marginBottom: 24 }}>
        <AntTitle level={5} style={{ marginBottom: 12 }}>
          {t('admin.dashboard.keyMetrics') || 'Key Metrics'}
        </AntTitle>
        <Row gutter={[12, 12]}>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card size="small" style={{ textAlign: 'center', padding: '8px 0', height: '100%', minHeight: '110px', display: 'flex', alignItems: 'center' }} bodyStyle={{ padding: '12px 8px', width: '100%' }}>
              <Statistic
                title={t('admin.dashboard.totalSimulations') || 'Total Simulations'}
                value={summary.totalUsages}
                prefix={<CalculatorOutlined />}
                valueStyle={{ color: '#1890ff', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card size="small" style={{ textAlign: 'center', padding: '8px 0', height: '100%', minHeight: '110px', display: 'flex', alignItems: 'center' }} bodyStyle={{ padding: '12px 8px', width: '100%' }}>
              <Statistic
                title={t('admin.dashboard.avgMonthlyIncome') || 'Avg Monthly Income'}
                value={summary.averageMonthlyIncome.toFixed(0)}
                suffix="PLN"
                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card size="small" style={{ textAlign: 'center', padding: '8px 0', height: '100%', minHeight: '110px', display: 'flex', alignItems: 'center' }} bodyStyle={{ padding: '12px 8px', width: '100%' }}>
              <Statistic
                title={t('admin.dashboard.avgRetirementAge') || 'Avg Retirement Age'}
                value={summary.averageRetirementAge.toFixed(1)}
                suffix={t('admin.dashboard.years') || 'years'}
                valueStyle={{ color: '#faad14', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card size="small" style={{ textAlign: 'center', padding: '8px 0', height: '100%', minHeight: '110px', display: 'flex', alignItems: 'center' }} bodyStyle={{ padding: '12px 8px', width: '100%' }}>
              <Statistic
                title={t('admin.dashboard.avgPension') || 'Avg Projected Pension'}
                value={summary.averageProjectedPension.toFixed(0)}
                suffix="PLN"
                valueStyle={{ color: '#722ed1', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card size="small" style={{ textAlign: 'center', padding: '8px 0', height: '100%', minHeight: '110px', display: 'flex', alignItems: 'center' }} bodyStyle={{ padding: '12px 8px', width: '100%' }}>
              <Statistic
                title={t('admin.dashboard.pensionRatio') || 'Pension/Income Ratio'}
                value={pensionToIncomeRatio}
                suffix="%"
                valueStyle={{ color: '#eb2f96', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card size="small" style={{ textAlign: 'center', padding: '8px 0', height: '100%', minHeight: '110px', display: 'flex', alignItems: 'center' }} bodyStyle={{ padding: '12px 8px', width: '100%' }}>
              <Statistic
                title={t('admin.dashboard.weeklyAvg') || 'Weekly Avg Usage'}
                value={weeklyAverage}
                valueStyle={{ color: '#13c2c2', fontSize: '20px' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Usage Trends */}
      <div style={{ marginBottom: 24 }}>
        <AntTitle level={5} style={{ marginBottom: 12 }}>
          {t('admin.dashboard.usageTrends') || 'Usage Trends (Last 30 Days)'}
        </AntTitle>
        <Card bodyStyle={{ padding: '16px' }}>
          <div style={{ height: '200px' }}>
            <Line data={usageTrendsData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Simulation Type Distribution */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={8}>
            <AntTitle level={5} style={{ marginBottom: 12 }}>
              {t('admin.dashboard.simulationType') || 'Simulation Type'}
            </AntTitle>
            <Card bodyStyle={{ padding: '16px' }}>
              <div style={{ height: '180px' }}>
                <Doughnut data={simulatorTypeData} options={chartOptions} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <AntTitle level={5} style={{ marginBottom: 12 }}>
              {t('admin.dashboard.genderDistribution') || 'Gender Distribution'}
            </AntTitle>
            <Card bodyStyle={{ padding: '16px' }}>
              <div style={{ height: '180px' }}>
                <Pie data={genderData} options={chartOptions} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <AntTitle level={5} style={{ marginBottom: 12 }}>
              {t('admin.dashboard.employmentDistribution') || 'Employment Type'}
            </AntTitle>
            <Card bodyStyle={{ padding: '16px' }}>
              <div style={{ height: '180px' }}>
                <Bar data={employmentData} options={barChartOptions} />
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Age and Income Distribution */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <AntTitle level={5} style={{ marginBottom: 12 }}>
              {t('admin.dashboard.ageDistribution') || 'Age Distribution'}
            </AntTitle>
            <Card bodyStyle={{ padding: '16px' }}>
              <div style={{ height: '200px' }}>
                <Bar data={ageRangeData} options={barChartOptions} />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <AntTitle level={5} style={{ marginBottom: 12 }}>
              {t('admin.dashboard.incomeDistribution') || 'Income Distribution'}
            </AntTitle>
            <Card bodyStyle={{ padding: '16px' }}>
              <div style={{ height: '200px' }}>
                <Bar data={incomeRangeData} options={barChartOptions} />
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Additional Insights */}
      <div>
        <AntTitle level={5} style={{ marginBottom: 12 }}>
          {t('admin.dashboard.insights') || 'Additional Insights'}
        </AntTitle>
        <Card bodyStyle={{ padding: '16px' }}>
          <Row gutter={[12, 12]}>
            <Col xs={12} sm={8} md={6}>
              <Text strong style={{ fontSize: '12px' }}>{t('admin.dashboard.avgRetirementAgeMale') || 'Avg Retirement Age (Male)'}:</Text>
              <br />
              <Text style={{ fontSize: '16px', fontWeight: 500, color: '#1890ff' }}>
                {summary.retirementAgeByGender.male.toFixed(1)} {t('admin.dashboard.years') || 'years'}
              </Text>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Text strong style={{ fontSize: '12px' }}>{t('admin.dashboard.avgRetirementAgeFemale') || 'Avg Retirement Age (Female)'}:</Text>
              <br />
              <Text style={{ fontSize: '16px', fontWeight: 500, color: '#eb2f96' }}>
                {summary.retirementAgeByGender.female.toFixed(1)} {t('admin.dashboard.years') || 'years'}
              </Text>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Text strong style={{ fontSize: '12px' }}>{t('admin.dashboard.mostCommonEmployment') || 'Most Common Employment'}:</Text>
              <br />
              <Text style={{ fontSize: '14px', fontWeight: 500, color: '#52c41a' }}>
                {Object.entries(summary.employmentTypeDistribution).length > 0 
                  ? t(`simulator.form.employmentType.${Object.entries(summary.employmentTypeDistribution)
                      .sort((a, b) => b[1] - a[1])[0][0]}`) 
                  : 'N/A'}
              </Text>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Text strong style={{ fontSize: '12px' }}>{t('admin.dashboard.mostCommonAgeRange') || 'Most Common Age Range'}:</Text>
              <br />
              <Text style={{ fontSize: '16px', fontWeight: 500, color: '#faad14' }}>
                {Object.entries(summary.ageRangeDistribution).length > 0 
                  ? Object.entries(summary.ageRangeDistribution)
                      .sort((a, b) => b[1] - a[1])[0][0]
                  : 'N/A'}
              </Text>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Text strong style={{ fontSize: '12px' }}>{t('admin.dashboard.avgYearsUntilRetirement') || 'Avg Years Until Retirement'}:</Text>
              <br />
              <Text style={{ fontSize: '16px', fontWeight: 500, color: '#722ed1' }}>
                {avgYearsUntilRetirement > 0 ? avgYearsUntilRetirement.toFixed(1) : 'N/A'} {avgYearsUntilRetirement > 0 ? (t('admin.dashboard.years') || 'years') : ''}
              </Text>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Text strong style={{ fontSize: '12px' }}>{t('admin.dashboard.mostActiveDay') || 'Most Active Day'}:</Text>
              <br />
              <Text style={{ fontSize: '14px', fontWeight: 500, color: '#13c2c2' }}>
                {mostActiveDay}
              </Text>
            </Col>
          </Row>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;