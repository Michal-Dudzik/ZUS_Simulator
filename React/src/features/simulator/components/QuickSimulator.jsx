import React from 'react';
import { Button, Input, Form, Select, Row, Col } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import './SimulationContent.css';

const QuickSimulator = () => {
  return (
    <div className="simulation-content quick-simulation">
      <div className="content-header">
        <CalculatorOutlined className="content-icon" />
        <h3>Quick Simulation</h3>
        <p>Get instant results with basic information</p>
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
        
        <div className="form-actions">
          <Button 
            type="primary" 
            size="large"
            icon={<CalculatorOutlined />}
            className="calculate-button"
          >
            Calculate Contributions
          </Button>
        </div>
      </Form>
      
      <div className="results-preview">
        <h4>Estimated Results</h4>
        <div className="results-grid">
          <div className="result-item">
            <span className="result-label">ZUS Contributions</span>
            <span className="result-value">- PLN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Net Income</span>
            <span className="result-value">- PLN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSimulator;
