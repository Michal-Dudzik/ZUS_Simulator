import React, { useState } from 'react';
import { Button, Input, Form, Select, Row, Col, DatePicker, Checkbox, Radio } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import { useLanguage } from '../../../i18n/useLanguage';
import dayjs from 'dayjs';

const QuickForm = ({ form, onCalculate, loading, updateRetirementAge }) => {
  const { t } = useLanguage();
  const [retirementInputType, setRetirementInputType] = useState('age'); // 'age' or 'year'

  return (
    <>
      <Form layout="vertical" className="simulation-form" form={form} style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item 
              label={t('simulator.quick.form.birthDate')}
              name="birthDate"
              rules={[
                { required: true, message: t('simulator.quick.form.birthDateRequired') },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const birthDate = dayjs(value);
                    const today = dayjs();
                    if (birthDate.isAfter(today)) {
                      return Promise.reject(new Error(t('simulator.quick.form.birthDateFuture')));
                    }
                    const age = today.diff(birthDate, 'year');
                    if (age < 16) {
                      return Promise.reject(new Error(t('simulator.quick.form.birthDateTooYoung')));
                    }
                    if (age > 100) {
                      return Promise.reject(new Error(t('simulator.quick.form.birthDateTooOld')));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <DatePicker 
                placeholder={t('simulator.quick.form.birthDatePlaceholder')}
                size="large"
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
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
              label={t('simulator.quick.form.workStartYear')}
              name="workStartYear"
              rules={[
                { required: true, message: t('simulator.quick.form.workStartYearRequired') },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const year = parseInt(value);
                    const currentYear = new Date().getFullYear();
                    const birthDate = form.getFieldValue('birthDate');
                    
                    if (year > currentYear) {
                      return Promise.reject(new Error(t('simulator.quick.form.workStartYearFuture')));
                    }
                    
                    if (birthDate) {
                      const birthYear = dayjs(birthDate).year();
                      if (year < birthYear + 16) {
                        return Promise.reject(new Error(t('simulator.quick.form.workStartYearTooEarly')));
                      }
                    }
                    
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                placeholder={t('simulator.quick.form.workStartYearPlaceholder')}
                size="large"
                type="number"
                min="1950"
                max={new Date().getFullYear()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label={t('simulator.quick.form.retirementLabel')}>
              <Radio.Group 
                value={retirementInputType} 
                onChange={(e) => {
                  setRetirementInputType(e.target.value);
                  // Clear the other field when switching
                  if (e.target.value === 'age') {
                    form.setFieldsValue({ retirementYear: undefined });
                  } else {
                    form.setFieldsValue({ retirementAge: undefined });
                  }
                }}
                style={{ marginBottom: 8 }}
              >
                <Radio.Button value="age">{t('simulator.quick.form.retirementByAge')}</Radio.Button>
                <Radio.Button value="year">{t('simulator.quick.form.retirementByYear')}</Radio.Button>
              </Radio.Group>
              
              {retirementInputType === 'age' ? (
                <Form.Item 
                  name="retirementAge"
                  noStyle
                  rules={[
                    { required: true, message: t('simulator.quick.form.retirementAgeRequired') },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const age = parseInt(value);
                        const birthDate = form.getFieldValue('birthDate');
                        
                        if (age < 50 || age > 80) {
                          return Promise.reject(new Error(t('simulator.quick.form.retirementAgeRange')));
                        }
                        
                        if (birthDate) {
                          const currentAge = dayjs().diff(dayjs(birthDate), 'year');
                          if (age <= currentAge) {
                            return Promise.reject(new Error(t('simulator.quick.form.retirementAgeTooLow')));
                          }
                        }
                        
                        return Promise.resolve();
                      }
                    }
                  ]}
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
              ) : (
                <Form.Item 
                  name="retirementYear"
                  noStyle
                  rules={[
                    { required: true, message: t('simulator.quick.form.retirementYearRequired') },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const year = parseInt(value);
                        const currentYear = new Date().getFullYear();
                        const workStartYear = form.getFieldValue('workStartYear');
                        
                        if (year < currentYear) {
                          return Promise.reject(new Error(t('simulator.quick.form.retirementYearPast')));
                        }
                        
                        if (workStartYear && year <= parseInt(workStartYear)) {
                          return Promise.reject(new Error(t('simulator.quick.form.retirementYearBeforeWork')));
                        }
                        
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input 
                    placeholder={t('simulator.quick.form.retirementYearPlaceholder')}
                    size="large"
                    type="number"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 50}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item 
              label={t('simulator.quick.form.postalCode')}
              name="postalCode"
            >
              <Input 
                placeholder={t('simulator.quick.form.postalCodePlaceholder')}
                size="large"
                maxLength={6}
              />
            </Form.Item>
            <div style={{ marginTop: '-16px', marginBottom: '8px', fontSize: '0.85em', color: '#888' }}>
              {t('simulator.quick.form.postalCodeInfo')}
            </div>
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
