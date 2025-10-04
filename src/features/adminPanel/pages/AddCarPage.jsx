import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, message, Space, Divider, Row, Col, DatePicker, Switch, Alert } from 'antd';
import { FormOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageLayout from '../components/PageLayout';

const { TextArea } = Input;
const { Option } = Select;

const CreateItemPage = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // TODO: Implement API call when ready
            console.log('Form values:', values);
            console.log('Files:', fileList);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            message.success(t('admin.createItem.success'));
            form.resetFields();
            setFileList([]);
        } catch {
            message.error(t('admin.createItem.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const beforeUpload = (file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const isImage = allowedTypes.includes(file.type);
        if (!isImage) {
            message.error(t('admin.createItem.invalidFileType'));
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error(t('admin.createItem.fileTooLarge'));
            return false;
        }
        return false; // Prevent auto upload
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>
                {t('admin.createItem.uploadImage')}
            </div>
        </div>
    );

    return (
        <PageLayout 
            icon={FormOutlined}
            title={t('admin.createItem.title')}
            cardClassName="create-item-page-card"
        >
            {/* Page Description */}
            <Alert
                message={t('admin.createItem.welcome.title')}
                description={t('admin.createItem.welcome.description')}
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                    style={{ maxWidth: 800, width: '100%' }}
                >
                {/* Basic Information */}
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 16 }}>
                        {t('admin.createItem.basicInfo')}
                    </h3>
                    
                    <Form.Item
                        label={t('admin.createItem.name')}
                        name="name"
                        rules={[{ required: true, message: t('admin.createItem.nameRequired') }]}
                    >
                        <Input 
                            placeholder={t('admin.createItem.namePlaceholder')} 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label={t('admin.createItem.description')}
                        name="description"
                        rules={[{ required: true, message: t('admin.createItem.descriptionRequired') }]}
                    >
                        <TextArea 
                            rows={4}
                            placeholder={t('admin.createItem.descriptionPlaceholder')}
                            size="large"
                        />
                    </Form.Item>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={t('admin.createItem.category')}
                                name="category"
                                rules={[{ required: true, message: t('admin.createItem.categoryRequired') }]}
                            >
                                <Select 
                                    placeholder={t('admin.createItem.categoryPlaceholder')}
                                    size="large"
                                >
                                    <Option value="technology">{t('admin.createItem.categories.technology')}</Option>
                                    <Option value="business">{t('admin.createItem.categories.business')}</Option>
                                    <Option value="education">{t('admin.createItem.categories.education')}</Option>
                                    <Option value="entertainment">{t('admin.createItem.categories.entertainment')}</Option>
                                    <Option value="other">{t('admin.createItem.categories.other')}</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={t('admin.createItem.priority')}
                                name="priority"
                            >
                                <Select 
                                    placeholder={t('admin.createItem.priorityPlaceholder')}
                                    size="large"
                                >
                                    <Option value="low">{t('admin.createItem.priorities.low')}</Option>
                                    <Option value="medium">{t('admin.createItem.priorities.medium')}</Option>
                                    <Option value="high">{t('admin.createItem.priorities.high')}</Option>
                                    <Option value="urgent">{t('admin.createItem.priorities.urgent')}</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <Divider />

                {/* Additional Details */}
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 16 }}>
                        {t('admin.createItem.additionalDetails')}
                    </h3>
                    
                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={t('admin.createItem.startDate')}
                                name="startDate"
                            >
                                <DatePicker 
                                    style={{ width: '100%' }}
                                    size="large"
                                    placeholder={t('admin.createItem.startDatePlaceholder')}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={t('admin.createItem.endDate')}
                                name="endDate"
                            >
                                <DatePicker 
                                    style={{ width: '100%' }}
                                    size="large"
                                    placeholder={t('admin.createItem.endDatePlaceholder')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={t('admin.createItem.budget')}
                                name="budget"
                            >
                                <InputNumber 
                                    placeholder={t('admin.createItem.budgetPlaceholder')} 
                                    style={{ width: '100%' }}
                                    size="large"
                                    min={0}
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={t('admin.createItem.assignee')}
                                name="assignee"
                            >
                                <Input 
                                    placeholder={t('admin.createItem.assigneePlaceholder')} 
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label={t('admin.createItem.tags')}
                        name="tags"
                    >
                        <Select 
                            mode="tags"
                            placeholder={t('admin.createItem.tagsPlaceholder')}
                            size="large"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={t('admin.createItem.isActive')}
                        name="isActive"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch />
                    </Form.Item>
                </div>

                <Divider />

                {/* Images */}
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 16 }}>
                        {t('admin.createItem.attachments')}
                    </h3>
                    
                    <Form.Item
                        label={t('admin.createItem.uploadImages')}
                        name="images"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={beforeUpload}
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            multiple
                        >
                            {fileList.length >= 5 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                </div>

                <Divider />

                {/* Submit Button */}
                <Form.Item>
                    <Space size="middle">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            size="large"
                            icon={<SaveOutlined />}
                        >
                            {t('admin.createItem.submit')}
                        </Button>
                        <Button 
                            htmlType="button" 
                            onClick={() => {
                                form.resetFields();
                                setFileList([]);
                            }}
                            size="large"
                        >
                            {t('admin.createItem.reset')}
                        </Button>
                    </Space>
                </Form.Item>
                </Form>
            </div>
        </PageLayout>
    );
};

export default CreateItemPage; 