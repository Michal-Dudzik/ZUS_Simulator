import React from 'react';
import { Button, Input, Form, Select, Row, Col, Divider } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import './SimulationContent.css';

const DetailedSimulator = () => {
  return (
    <div className="simulation-content detailed-simulation">
      <div className="content-header">
        <BarChartOutlined className="content-icon" />
        <h3>Detailed Simulation</h3>
        <p>Comprehensive analysis with advanced options</p>
      </div>
      
      <Form layout="vertical" className="simulation-form">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Monthly Income" required>
              <Input 
                placeholder="Enter monthly income" 
                suffix="PLN"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Employment Type">
              <Select placeholder="Select employment type" size="large">
                <Select.Option value="employment">Employment Contract</Select.Option>
                <Select.Option value="b2b">B2B Contract</Select.Option>
                <Select.Option value="self-employed">Self-employed</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Divider>Advanced Options</Divider>
        
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item label="Age">
              <Input placeholder="Enter age" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Years of Service">
              <Input placeholder="Years worked" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Additional Benefits">
              <Select placeholder="Select benefits" size="large" mode="multiple">
                <Select.Option value="disability">Disability Insurance</Select.Option>
                <Select.Option value="sickness">Sickness Insurance</Select.Option>
                <Select.Option value="accident">Accident Insurance</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Contribution Base">
              <Select placeholder="Select contribution base" size="large">
                <Select.Option value="minimum">Minimum Base</Select.Option>
                <Select.Option value="actual">Actual Income</Select.Option>
                <Select.Option value="custom">Custom Amount</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Simulation Period">
              <Select placeholder="Select period" size="large">
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="quarterly">Quarterly</Select.Option>
                <Select.Option value="yearly">Yearly</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <div className="form-actions">
          <Button 
            type="primary" 
            size="large"
            icon={<BarChartOutlined />}
            className="calculate-button"
          >
            Run Detailed Analysis
          </Button>
        </div>
      </Form>
      
      <div className="results-preview">
        <h4>Detailed Analysis Results</h4>
        <div className="results-grid detailed">
          <div className="result-item">
            <span className="result-label">Social Insurance</span>
            <span className="result-value">- PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Health Insurance</span>
            <span className="result-value">- PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Disability Insurance</span>
            <span className="result-value">- PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Total Contributions</span>
            <span className="result-value">- PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Net Income</span>
            <span className="result-value">- PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Future Benefits</span>
            <span className="result-value">- PLN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedSimulator;
