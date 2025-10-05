import React from 'react';
import { Button, Input, Form, Select, Row, Col, DatePicker, Checkbox } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import { useLanguage } from '../../../i18n/useLanguage';

const QuickForm = ({ form, onCalculate, loading, updateRetirementAge }) => {
  const { t } = useLanguage();

  return (
    <>
      <Form layout="vertical" className="simulation-form" form={form} style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item 
              label={t('simulator.quick.form.currentAge')}
              name="currentAge"
              rules={[{ required: true, message: t('simulator.quick.form.currentAgeRequired') }]}
            >
              <Input 
                placeholder={t('simulator.quick.form.currentAgePlaceholder')}
                suffix={t('simulator.quick.form.currentAgeUnit')}
                size="large"
                type="number"
                min="18"
                max="85"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item 
              label={t('simulator.quick.form.gender')}
              name="gender"
              rules={[{ required: true, message: t('simulator.quick.form.genderRequired') }]}
              initialValue="male"
            >
              <Select 
                placeholder={t('simulator.quick.form.genderPlaceholder')}
                size="large"
                onChange={updateRetirementAge}
              >
                <Select.Option value="male">{t('simulator.quick.form.genderMale')}</Select.Option>
                <Select.Option value="female">{t('simulator.quick.form.genderFemale')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item 
              label={t('simulator.quick.form.monthlyIncome')}
              name="monthlyIncome"
              rules={[{ required: true, message: t('simulator.quick.form.monthlyIncomeRequired') }]}
            >
              <Input 
                placeholder={t('simulator.quick.form.monthlyIncomePlaceholder')}
                suffix="PLN"
                size="large"
                type="number"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item 
              label={t('simulator.quick.form.employmentType')}
              name="employmentType"
              rules={[{ required: true, message: t('simulator.quick.form.employmentTypeRequired') }]}
              initialValue="employment"
            >
              <Select placeholder={t('simulator.quick.form.employmentTypePlaceholder')} size="large">
                <Select.Option value="employment">{t('simulator.quick.form.employmentContract')}</Select.Option>
                <Select.Option value="b2b">{t('simulator.quick.form.b2bContract')}</Select.Option>
                <Select.Option value="self-employed">{t('simulator.quick.form.selfEmployed')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item 
              label={t('simulator.quick.form.workStartDate')}
              name="workStartDate"
              rules={[{ required: true, message: t('simulator.quick.form.workStartDateRequired') }]}
            >
              <DatePicker 
                placeholder={t('simulator.quick.form.workStartDatePlaceholder')}
                size="large"
                style={{ width: '100%' }}
                picker="year"
                format="YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item 
              label={t('simulator.quick.form.retirementAge')}
              name="retirementAge"
              rules={[{ required: true, message: t('simulator.quick.form.retirementAgeRequired') }]}
            >
              <Input 
                placeholder={t('simulator.quick.form.retirementAgePlaceholder')}
                suffix={t('simulator.quick.form.retirementAgeUnit')}
                size="large"
                type="number"
                min="50"
                max="80"
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item 
              name="considerSickLeave"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>
                {t('simulator.quick.form.considerSickLeave')} {' '}
                <span style={{ color: '#888', fontSize: '0.9em' }}>
                  {t('simulator.quick.form.considerSickLeaveInfo')}
                </span>
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
        
        <div className="form-actions">
          <Button 
            type="primary" 
            size="large"
            icon={<CalculatorOutlined />}
            className="calculate-button"
            onClick={onCalculate}
            loading={loading}
          >
            {t('simulator.quick.form.calculateButton')}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default QuickForm;
