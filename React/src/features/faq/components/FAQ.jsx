import React from 'react';
import { Card, Collapse, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import faqData from '../data/faqData';
import FAQQuestionForm from './FAQQuestionForm';

const { Title, Text } = Typography;

const FAQ = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Card>
        <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <QuestionCircleOutlined />
          {t('faq.title')}
        </Title>
        <Text type="secondary">
          {t('faq.subtitle')}
        </Text>
        
        <Collapse
          style={{ marginTop: '1rem' }}
          items={faqData.map((item) => ({
            key: item.id,
            label: <Text strong>{item.question}</Text>,
            children: <Text>{item.answer}</Text>
          }))}
        />
      </Card>
      
      <FAQQuestionForm />
    </>
  );
};

export default FAQ;
