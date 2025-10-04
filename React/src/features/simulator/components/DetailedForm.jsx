import React from 'react';
import { Button, Input, Form, Select, Row, Col, Divider, DatePicker } from 'antd';
import { BarChartOutlined, EditOutlined } from '@ant-design/icons';
import { useLanguage } from '../../../i18n/useLanguage';

const DetailedForm = ({ form, onCalculate, onBack, loading, updateRetirementAge }) => {
  const { t } = useLanguage();

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
                picker="month"
                format="MM/YYYY"
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

        {/* Advanced Options */}
        <Divider orientation="left">Opcje zaawansowane</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
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
          <Col xs={24} sm={8}>
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
          <Col xs={24} sm={8}>
            <Form.Item 
              label={t('simulator.detailed.form.simulationPeriod')}
              name="simulationPeriod"
            >
              <Select placeholder={t('simulator.detailed.form.simulationPeriodPlaceholder')} size="large">
                <Select.Option value="monthly">{t('simulator.detailed.form.monthly')}</Select.Option>
                <Select.Option value="quarterly">{t('simulator.detailed.form.quarterly')}</Select.Option>
                <Select.Option value="yearly">{t('simulator.detailed.form.yearly')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Form.Item 
              label={t('simulator.detailed.form.annualValorization')}
              name="annualValorization"
            >
              <Input 
                placeholder={t('simulator.detailed.form.annualValorizationPlaceholder')}
                suffix="%"
                size="large"
                type="number"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item 
              label={t('simulator.detailed.form.initialCapital')}
              name="initialCapital"
            >
              <Input 
                placeholder={t('simulator.detailed.form.initialCapitalPlaceholder')}
                suffix="PLN"
                size="large"
                type="number"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item 
              label={t('simulator.detailed.form.zusSubaccount')}
              name="zusSubaccount"
            >
              <Input 
                placeholder={t('simulator.detailed.form.zusSubaccountPlaceholder')}
                suffix="PLN"
                size="large"
                type="number"
              />
            </Form.Item>
          </Col>
        </Row>
        
        <div className="form-actions">
          <Button 
            size="large"
            icon={<EditOutlined />}
            onClick={onBack}
            style={{ marginRight: '1rem' }}
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
          >
            {t('simulator.detailed.form.runAnalysisButton')}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default DetailedForm;
