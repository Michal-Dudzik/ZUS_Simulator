import React from 'react';
import { Card, Collapse, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import faqData from '../data/faqData';

const { Title, Text } = Typography;

const FAQ = () => {
  return (
    <Card>
      <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <QuestionCircleOutlined />
        Najczęściej zadawane pytania
      </Title>
      <Text type="secondary">
        Odpowiedzi na najważniejsze pytania dotyczące systemu emerytalnego i ZUS
      </Text>
      
      <Collapse
        items={faqData.map((item) => ({
          key: item.id,
          label: <Text strong>{item.question}</Text>,
          children: <Text>{item.answer}</Text>
        }))}
      />
    </Card>
  );
};

export default FAQ;
