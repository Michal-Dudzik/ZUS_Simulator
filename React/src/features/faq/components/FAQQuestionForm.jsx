import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { QuestionCircleOutlined, SendOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { submitFAQQuestion } from '../../../common/services/faqService';

const { TextArea } = Input;

const FAQQuestionForm = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await submitFAQQuestion(values.question, values.email);
      
      if (result.success) {
        message.success(t('faq.form.success'));
        form.resetFields();
      } else {
        message.error(result.error || t('faq.form.error'));
      }
    } catch (error) {
      console.error('Error submitting FAQ question:', error);
      message.error(t('faq.form.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <QuestionCircleOutlined />
          {t('faq.form.title')}
        </div>
      }
      style={{ marginTop: '1.5rem' }}
    >
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        {t('faq.form.description')}
      </p>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="question"
          label={t('faq.form.questionLabel')}
          rules={[
            { required: true, message: t('faq.form.questionRequired') },
            { min: 10, message: t('faq.form.questionMinLength') }
          ]}
        >
          <TextArea
            rows={4}
            placeholder={t('faq.form.questionPlaceholder')}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('faq.form.emailLabel')}
          rules={[
            { required: true, message: t('faq.form.emailRequired') },
            { type: 'email', message: t('faq.form.emailInvalid') }
          ]}
        >
          <Input 
            placeholder={t('faq.form.emailPlaceholder')}
            type="email"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SendOutlined />}
            block
          >
            {t('faq.form.submitButton')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FAQQuestionForm;
