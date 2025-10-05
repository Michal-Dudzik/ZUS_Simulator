import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Input, Select, message, Statistic, Row, Col } from 'antd';
import { 
  QuestionCircleOutlined, 
  ReloadOutlined, 
  DeleteOutlined, 
  CheckOutlined, 
  InboxOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  MailOutlined 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { 
  getFAQQuestions, 
  updateFAQQuestion, 
  deleteFAQQuestion,
  getFAQStatistics 
} from '../../../common/services/faqService';
import './FAQQuestionsPage.css';

const { TextArea } = Input;
const { Option } = Select;

const FAQQuestionsPage = () => {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [filterStatus, setFilterStatus] = useState(null);
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    loadQuestions();
    loadStatistics();
  }, [filterStatus]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const result = await getFAQQuestions(filterStatus);
      if (result.success) {
        setQuestions(result.data);
      } else {
        message.error(t('admin.faqQuestions.loadError'));
      }
    } catch (error) {
      console.error('Error loading FAQ questions:', error);
      message.error(t('admin.faqQuestions.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const result = await getFAQStatistics();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const result = await updateFAQQuestion(id, newStatus);
      if (result.success) {
        message.success(t('admin.faqQuestions.statusUpdated'));
        loadQuestions();
        loadStatistics();
      } else {
        message.error(t('admin.faqQuestions.updateError'));
      }
    } catch (error) {
      console.error('Error updating question status:', error);
      message.error(t('admin.faqQuestions.updateError'));
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: t('admin.faqQuestions.deleteConfirm'),
      content: t('admin.faqQuestions.deleteConfirmMessage'),
      okText: t('admin.faqQuestions.deleteOk'),
      cancelText: t('admin.faqQuestions.deleteCancel'),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const result = await deleteFAQQuestion(id);
          if (result.success) {
            message.success(t('admin.faqQuestions.deleted'));
            loadQuestions();
            loadStatistics();
          } else {
            message.error(t('admin.faqQuestions.deleteError'));
          }
        } catch (error) {
          console.error('Error deleting question:', error);
          message.error(t('admin.faqQuestions.deleteError'));
        }
      },
    });
  };

  const handleAnswerQuestion = (question) => {
    setCurrentQuestion(question);
    setAnswerText(question.answer || '');
    setAnswerModalVisible(true);
  };

  const handleSaveAnswer = async () => {
    if (!answerText.trim()) {
      message.warning(t('admin.faqQuestions.answerRequired'));
      return;
    }

    try {
      const result = await updateFAQQuestion(
        currentQuestion.id,
        'answered',
        answerText
      );
      
      if (result.success) {
        message.success(t('admin.faqQuestions.answerSaved'));
        setAnswerModalVisible(false);
        setCurrentQuestion(null);
        setAnswerText('');
        loadQuestions();
        loadStatistics();
      } else {
        message.error(t('admin.faqQuestions.answerError'));
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      message.error(t('admin.faqQuestions.answerError'));
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', icon: <ClockCircleOutlined />, text: t('admin.faqQuestions.statusPending') },
      answered: { color: 'green', icon: <CheckOutlined />, text: t('admin.faqQuestions.statusAnswered') },
      archived: { color: 'default', icon: <InboxOutlined />, text: t('admin.faqQuestions.statusArchived') },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: t('admin.faqQuestions.columnQuestion'),
      dataIndex: 'question',
      key: 'question',
      width: '40%',
      render: (text) => (
        <div style={{ wordBreak: 'break-word' }}>
          <QuestionCircleOutlined style={{ marginRight: '8px' }} />
          {text}
        </div>
      ),
    },
    {
      title: t('admin.faqQuestions.columnEmail'),
      dataIndex: 'email',
      key: 'email',
      width: '15%',
      render: (email) => (
        <span>
          <MailOutlined style={{ marginRight: '4px' }} />
          {email || '-'}
        </span>
      ),
    },
    {
      title: t('admin.faqQuestions.columnStatus'),
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status) => getStatusTag(status),
    },
    {
      title: t('admin.faqQuestions.columnDate'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: '15%',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('admin.faqQuestions.columnActions'),
      key: 'actions',
      width: '15%',
      render: (_, record) => (
        <Space size="small">
          {record.status !== 'answered' && (
            <Button
              type="primary"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleAnswerQuestion(record)}
            >
              {t('admin.faqQuestions.answer')}
            </Button>
          )}
          {record.status === 'answered' && (
            <Button
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleAnswerQuestion(record)}
            >
              {t('admin.faqQuestions.viewAnswer')}
            </Button>
          )}
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="faq-questions-page">
      <Card>
        <div className="page-header">
          <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <QuestionCircleOutlined />
              {t('admin.faqQuestions.title')}
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              {t('admin.faqQuestions.description')}
            </p>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadQuestions}
            loading={loading}
          >
            {t('admin.faqQuestions.refresh')}
          </Button>
        </div>

        <Row gutter={16} style={{ marginTop: '1.5rem' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t('admin.faqQuestions.totalQuestions')}
                value={statistics.total || 0}
                prefix={<QuestionCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t('admin.faqQuestions.pendingQuestions')}
                value={statistics.pending || 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t('admin.faqQuestions.answeredQuestions')}
                value={statistics.answered || 0}
                prefix={<CheckOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t('admin.faqQuestions.archivedQuestions')}
                value={statistics.archived || 0}
                prefix={<InboxOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
          <Space>
            <span>{t('admin.faqQuestions.filterByStatus')}:</span>
            <Select
              style={{ width: 200 }}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder={t('admin.faqQuestions.allStatuses')}
              allowClear
            >
              <Option value="pending">{t('admin.faqQuestions.statusPending')}</Option>
              <Option value="answered">{t('admin.faqQuestions.statusAnswered')}</Option>
              <Option value="archived">{t('admin.faqQuestions.statusArchived')}</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={questions}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => t('admin.faqQuestions.totalItems', { total }),
          }}
          locale={{
            emptyText: (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <QuestionCircleOutlined style={{ fontSize: '3rem', color: '#d9d9d9' }} />
                <p style={{ marginTop: '1rem', color: '#999' }}>
                  {t('admin.faqQuestions.noQuestions')}
                </p>
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title={
          <span>
            <FileTextOutlined style={{ marginRight: '8px' }} />
            {currentQuestion?.answer 
              ? t('admin.faqQuestions.viewAnswer') 
              : t('admin.faqQuestions.answerQuestion')}
          </span>
        }
        open={answerModalVisible}
        onOk={handleSaveAnswer}
        onCancel={() => {
          setAnswerModalVisible(false);
          setCurrentQuestion(null);
          setAnswerText('');
        }}
        okText={t('admin.faqQuestions.saveAnswer')}
        cancelText={t('admin.faqQuestions.cancel')}
        width={700}
      >
        <div style={{ marginBottom: '1rem' }}>
          <strong>{t('admin.faqQuestions.question')}:</strong>
          <p style={{ 
            padding: '12px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            marginTop: '8px' 
          }}>
            {currentQuestion?.question}
          </p>
        </div>
        
        {currentQuestion?.email && (
          <div style={{ marginBottom: '1rem' }}>
            <strong>{t('admin.faqQuestions.submittedBy')}:</strong>
            <p style={{ marginTop: '4px' }}>{currentQuestion.email}</p>
          </div>
        )}

        <div>
          <strong>{t('admin.faqQuestions.answerLabel')}:</strong>
          <TextArea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={6}
            placeholder={t('admin.faqQuestions.answerPlaceholder')}
            style={{ marginTop: '8px' }}
            disabled={currentQuestion?.status === 'answered' && currentQuestion?.answer}
          />
        </div>

        {currentQuestion?.status === 'pending' && (
          <div style={{ marginTop: '1rem' }}>
            <Space>
              <Button
                onClick={() => handleStatusChange(currentQuestion.id, 'archived')}
              >
                {t('admin.faqQuestions.markAsArchived')}
              </Button>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FAQQuestionsPage;
