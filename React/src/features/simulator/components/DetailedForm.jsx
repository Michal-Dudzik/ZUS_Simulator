import React, { useState } from 'react';
import { Button, Input, Form, Select, Row, Col, Divider, DatePicker, Checkbox, Radio } from 'antd';
import { BarChartOutlined, EditOutlined } from '@ant-design/icons';
import { useLanguage } from '../../../i18n/useLanguage';
import dayjs from 'dayjs';

const DetailedForm = ({ form, onCalculate, onBack, loading, updateRetirementAge }) => {
  const { t } = useLanguage();
  const [considerSickLeave, setConsiderSickLeave] = useState(false);
  const [retirementInputType, setRetirementInputType] = useState('age');
  const [employmentType, setEmploymentType] = useState(form.getFieldValue('employmentType') || 'employment');

  return (
    <>
      <h3 className="section-title">Szczegółowa symulacja</h3>
      <p className="section-description">
        Uzupełnij dodatkowe informacje dla bardziej precyzyjnej symulacji. Twoje podstawowe dane zostały już wypełnione.
      </p>
      
      <Form layout="vertical" className="simulation-form" form={form}>
        {/* Basic Info - Already filled from quick form */}
        <Divider orientation="left">Podstawowe informacje</Divider>
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
            >
              <Select 
                placeholder={t('simulator.quick.form.employmentTypePlaceholder')} 
                size="large"
                onChange={(value) => setEmploymentType(value)}
              >
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

        {/* Advanced Options */}
        <Divider orientation="left">Opcje zaawansowane</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item 
              label={t('simulator.detailed.form.additionalBenefits')}
              name="additionalBenefits"
            >
              <Select 
                placeholder={t('simulator.detailed.form.additionalBenefitsPlaceholder')} 
                size="large" 
                mode="multiple"
              >
                <Select.Option value="disability">{t('simulator.detailed.form.disabilityInsurance')}</Select.Option>
                <Select.Option value="sickness">{t('simulator.detailed.form.sicknessInsurance')}</Select.Option>
                <Select.Option value="accident">{t('simulator.detailed.form.accidentInsurance')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item 
              label={t('simulator.quick.form.postalCode')}
              name="postalCode"
            >
              <Input 
                placeholder={t('simulator.quick.form.postalCodePlaceholder')}
                size="large"
                maxLength={6}
                style={{ width: '150px' }}
              />
            </Form.Item>
            <div style={{ marginTop: '-16px', marginBottom: '8px', fontSize: '0.85em', color: '#888' }}>
              {t('simulator.quick.form.postalCodeInfo')}
            </div>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          {/* Show contributionBase only for b2b and self-employed */}
          {(employmentType === 'b2b' || employmentType === 'self-employed') && (
            <Col xs={24} sm={12}>
              <Form.Item 
                label={t('simulator.detailed.form.contributionBase')}
                name="contributionBase"
              >
                <Select placeholder={t('simulator.detailed.form.contributionBasePlaceholder')} size="large">
                  <Select.Option value="minimum">{t('simulator.detailed.form.minimumBase')}</Select.Option>
                  <Select.Option value="actual">{t('simulator.detailed.form.actualIncome')}</Select.Option>
                  <Select.Option value="custom">{t('simulator.detailed.form.customAmount')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          )}
          
          <Col xs={24} sm={12}>
            <Form.Item 
              name="considerSickLeave"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox onChange={(e) => {
                setConsiderSickLeave(e.target.checked);
                if (!e.target.checked) {
                  form.setFieldsValue({ sickLeaveDays: undefined });
                }
              }}>
                {t('simulator.detailed.form.considerSickLeave')}
              </Checkbox>
            </Form.Item>
          </Col>
          {considerSickLeave && (
            <Col xs={24} sm={12}>
              <Form.Item 
                label={t('simulator.detailed.form.sickLeaveDays')}
                name="sickLeaveDays"
                rules={[
                  {
                    validator: (_, value) => {
                      if (value && (parseInt(value) < 0 || parseInt(value) > 365)) {
                        return Promise.reject(new Error(t('simulator.detailed.form.sickLeaveDaysRange')));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input 
                  placeholder={t('simulator.detailed.form.sickLeaveDaysPlaceholder')}
                  suffix={<span style={{ fontSize: '0.85em', color: '#888' }}>{t('simulator.detailed.form.useAverage')}</span>}
                  size="large"
                  type="number"
                  min="0"
                  max="365"
                  defaultValue={10}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        
        {/* Capital and Valorization Section */}
        <Divider orientation="left">{t('simulator.detailed.form.capitalSection')}</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Form.Item 
              label={t('simulator.detailed.form.initialCapital')}
              name="initialCapital"
              rules={[
                {
                  validator: (_, value) => {
                    if (value && parseFloat(value) < 0) {
                      return Promise.reject(new Error(t('simulator.detailed.form.initialCapitalNegative')));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                placeholder={t('simulator.detailed.form.initialCapitalPlaceholder')}
                suffix="PLN"
                size="large"
                type="number"
                min="0"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item 
              label={t('simulator.detailed.form.zusSubaccount')}
              name="zusSubaccount"
              rules={[
                {
                  validator: (_, value) => {
                    if (value && parseFloat(value) < 0) {
                      return Promise.reject(new Error(t('simulator.detailed.form.zusSubaccountNegative')));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                placeholder={t('simulator.detailed.form.zusSubaccountPlaceholder')}
                suffix="PLN"
                size="large"
                type="number"
                min="0"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item 
              label={t('simulator.detailed.form.capitalAsOfYear')}
              name="capitalAsOfYear"
              tooltip={t('simulator.detailed.form.capitalAsOfYearTooltip')}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const year = parseInt(value);
                    const currentYear = new Date().getFullYear();
                    const retirementYear = form.getFieldValue('retirementYear');
                    
                    if (year > currentYear) {
                      return Promise.reject(new Error(t('simulator.detailed.form.capitalAsOfYearFuture')));
                    }
                    
                    if (retirementYear && year > parseInt(retirementYear)) {
                      return Promise.reject(new Error(t('simulator.detailed.form.capitalAsOfYearAfterRetirement')));
                    }
                    
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                placeholder={currentYear => new Date().getFullYear().toString()}
                size="large"
                type="number"
                min="1950"
                max={new Date().getFullYear()}
              />
            </Form.Item>
          </Col>
        </Row>
        
        {/* Valorization Section */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Form.Item 
              label={t('simulator.detailed.form.annualValorization')}
              name="annualValorization"
              tooltip={t('simulator.detailed.form.annualValorizationTooltip')}
              rules={[
                {
                  validator: (_, value) => {
                    if (value && (parseFloat(value) < 0 || parseFloat(value) > 20)) {
                      return Promise.reject(new Error(t('simulator.detailed.form.annualValorizationRange')));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                placeholder={t('simulator.detailed.form.annualValorizationPlaceholder')}
                suffix="%"
                size="large"
                type="number"
                min="0"
                max="20"
                step="0.1"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item 
              label={t('simulator.detailed.form.valorizationSubaccount')}
              name="valorizationSubaccount"
              tooltip={t('simulator.detailed.form.valorizationSubaccountTooltip')}
              rules={[
                {
                  validator: (_, value) => {
                    if (value && (parseFloat(value) < 0 || parseFloat(value) > 20)) {
                      return Promise.reject(new Error(t('simulator.detailed.form.valorizationSubaccountRange')));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                placeholder={t('simulator.detailed.form.valorizationSubaccountPlaceholder')}
                suffix="%"
                size="large"
                type="number"
                min="0"
                max="20"
                step="0.1"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item 
              label={t('simulator.detailed.form.wageGrowthRate')}
              name="wageGrowthRate"
              tooltip={t('simulator.detailed.form.wageGrowthRateTooltip')}
              rules={[
                {
                  validator: (_, value) => {
                    if (value && (parseFloat(value) < 0 || parseFloat(value) > 8)) {
                      return Promise.reject(new Error(t('simulator.detailed.form.wageGrowthRateRange')));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                placeholder={t('simulator.detailed.form.wageGrowthRatePlaceholder')}
                suffix="%"
                size="large"
                type="number"
                min="0"
                max="8"
                step="0.1"
              />
            </Form.Item>
          </Col>
        </Row>
        
        <div className="form-actions" style={{ gap: '1rem' }}>
          <Button 
            size="large"
            icon={<EditOutlined />}
            onClick={onBack}
            style={{ flex: 1, height: '48px' }}
          >
            Powrót do wyników szybkich
          </Button>
          <Button 
            type="primary" 
            size="large"
            icon={<BarChartOutlined />}
            className="calculate-button"
            onClick={onCalculate}
            loading={loading}
            style={{ flex: 1 }}
          >
            {t('simulator.detailed.form.runAnalysisButton')}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default DetailedForm;
