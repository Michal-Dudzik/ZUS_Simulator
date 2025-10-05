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
import PageLayout from '../components/PageLayout';
import { 
  getAnalyticsSummary, 
  getUsageTrends, 
  clearAnalyticsData, 
  exportAnalyticsData 
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
        setSummary(analyticsSummary);
        setTrends(usageTrends);
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
    const data = exportAnalyticsData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulator-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

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
          {!isPresentationMode && (
            <>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                {t('admin.dashboard.export') || 'Export Data'}
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleClearData}>
                {t('admin.dashboard.clearData') || 'Clear Data'}
              </Button>
            </>
          )}
        </Space>
      </div>

      {/* Key Metrics */}
      <div style={{ marginBottom: 32 }}>
        <AntTitle level={4} style={{ marginBottom: 16 }}>
          {t('admin.dashboard.keyMetrics') || 'Key Metrics'}
        </AntTitle>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic
                title={t('admin.dashboard.totalSimulations') || 'Total Simulations'}
                value={summary.totalUsages}
                prefix={<CalculatorOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic
                title={t('admin.dashboard.avgMonthlyIncome') || 'Avg Monthly Income'}
                value={summary.averageMonthlyIncome.toFixed(0)}
                suffix="PLN"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic
                title={t('admin.dashboard.avgRetirementAge') || 'Avg Retirement Age'}
                value={summary.averageRetirementAge.toFixed(1)}
                suffix={t('admin.dashboard.years') || 'years'}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic
                title={t('admin.dashboard.avgPension') || 'Avg Projected Pension'}
                value={summary.averageProjectedPension.toFixed(0)}
                suffix="PLN"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Usage Trends */}
      <div style={{ marginBottom: 32 }}>
        <AntTitle level={4} style={{ marginBottom: 16 }}>
          {t('admin.dashboard.usageTrends') || 'Usage Trends (Last 30 Days)'}
        </AntTitle>
        <Card>
          <Line data={usageTrendsData} options={chartOptions} />
        </Card>
      </div>

      {/* Simulation Type Distribution */}
      <div style={{ marginBottom: 32 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <AntTitle level={4} style={{ marginBottom: 16 }}>
              {t('admin.dashboard.simulationType') || 'Simulation Type'}
            </AntTitle>
            <Card>
              <Doughnut data={simulatorTypeData} options={chartOptions} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <AntTitle level={4} style={{ marginBottom: 16 }}>
              {t('admin.dashboard.genderDistribution') || 'Gender Distribution'}
            </AntTitle>
            <Card>
              <Pie data={genderData} options={chartOptions} />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Employment Type Distribution */}
      <div style={{ marginBottom: 32 }}>
        <AntTitle level={4} style={{ marginBottom: 16 }}>
          {t('admin.dashboard.employmentDistribution') || 'Employment Type Distribution'}
        </AntTitle>
        <Card>
          <Bar data={employmentData} options={barChartOptions} />
        </Card>
      </div>

      {/* Age and Income Distribution */}
      <div style={{ marginBottom: 32 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <AntTitle level={4} style={{ marginBottom: 16 }}>
              {t('admin.dashboard.ageDistribution') || 'Age Distribution'}
            </AntTitle>
            <Card>
              <Bar data={ageRangeData} options={barChartOptions} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <AntTitle level={4} style={{ marginBottom: 16 }}>
              {t('admin.dashboard.incomeDistribution') || 'Income Distribution'}
            </AntTitle>
            <Card>
              <Bar data={incomeRangeData} options={barChartOptions} />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Additional Insights */}
      <div>
        <AntTitle level={4} style={{ marginBottom: 16 }}>
          {t('admin.dashboard.insights') || 'Additional Insights'}
        </AntTitle>
        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Text strong>{t('admin.dashboard.avgRetirementAgeMale') || 'Avg Retirement Age (Male)'}:</Text>
              <br />
              <Text>{summary.retirementAgeByGender.male.toFixed(1)} {t('admin.dashboard.years') || 'years'}</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text strong>{t('admin.dashboard.avgRetirementAgeFemale') || 'Avg Retirement Age (Female)'}:</Text>
              <br />
              <Text>{summary.retirementAgeByGender.female.toFixed(1)} {t('admin.dashboard.years') || 'years'}</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text strong>{t('admin.dashboard.mostCommonEmployment') || 'Most Common Employment Type'}:</Text>
              <br />
              <Text>
                {Object.entries(summary.employmentTypeDistribution).length > 0 
                  ? t(`simulator.form.employmentType.${Object.entries(summary.employmentTypeDistribution)
                      .sort((a, b) => b[1] - a[1])[0][0]}`) 
                  : 'N/A'}
              </Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text strong>{t('admin.dashboard.mostCommonAgeRange') || 'Most Common Age Range'}:</Text>
              <br />
              <Text>
                {Object.entries(summary.ageRangeDistribution).length > 0 
                  ? Object.entries(summary.ageRangeDistribution)
                      .sort((a, b) => b[1] - a[1])[0][0]
                  : 'N/A'}
              </Text>
            </Col>
          </Row>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;