import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form, Input, Select, Button, Card, message, Space,
  Typography, Switch, InputNumber, Divider, Spin
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { API_CONFIG } from '../../../config/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PublicationForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchPublication();
    }
  }, [id]);

  const fetchPublication = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/publications/${id}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        form.setFieldsValue(data.data);
      } else {
        message.error('논문 정보를 불러오는데 실패했습니다.');
        navigate('/admin/publications');
      }
    } catch (err) {
      message.error('서버 오류');
      navigate('/admin/publications');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSaving(true);

    try {
      const url = isEdit
        ? `${API_CONFIG.BASE_URL}/api/publications/${id}`
        : `${API_CONFIG.BASE_URL}/api/publications`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      });

      const data = await res.json();

      if (data.success) {
        message.success(isEdit ? '논문이 수정되었습니다.' : '논문이 추가되었습니다.');
        navigate('/admin/publications');
      } else {
        message.error(data.message);
      }
    } catch (err) {
      message.error('저장 실패');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/publications')}>
            목록으로
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            {isEdit ? '논문 수정' : '논문 추가'}
          </Title>
        </Space>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={() => form.submit()}
        >
          저장
        </Button>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            type: 'Journal',
            category: 'SCI',
            year: new Date().getFullYear(),
            isActive: true,
            isSelected: false,
            isWorkInProgress: false,
            authors: ['']
          }}
        >
          <Form.Item
            name="title"
            label="논문 제목"
            rules={[{ required: true, message: '제목을 입력해주세요' }]}
          >
            <TextArea rows={2} placeholder="논문 제목" />
          </Form.Item>

          <Form.List name="authors">
            {(fields, { add, remove }) => (
              <Form.Item label="저자">
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...field}
                      rules={[{ required: index === 0, message: '저자를 입력해주세요' }]}
                      noStyle
                    >
                      <Input placeholder="저자명" style={{ width: 200 }} />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    )}
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  저자 추가
                </Button>
              </Form.Item>
            )}
          </Form.List>

          <Space size="large" wrap>
            <Form.Item
              name="year"
              label="출판 연도"
              rules={[{ required: true }]}
            >
              <InputNumber min={1990} max={2030} />
            </Form.Item>

            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true }]}
            >
              <Select style={{ width: 140 }}>
                <Select.Option value="Journal">Journal</Select.Option>
                <Select.Option value="Conference">Conference</Select.Option>
                <Select.Option value="Patent">Patent</Select.Option>
                <Select.Option value="Book">Book</Select.Option>
                <Select.Option value="Thesis">Thesis</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select style={{ width: 140 }}>
                <Select.Option value="SCI">SCI</Select.Option>
                <Select.Option value="SSCI">SSCI</Select.Option>
                <Select.Option value="SCI/SSCI">SCI/SSCI</Select.Option>
                <Select.Option value="KCI">KCI</Select.Option>
                <Select.Option value="Scopus">Scopus</Select.Option>
                <Select.Option value="KR Patent">KR Patent</Select.Option>
                <Select.Option value="US Patent">US Patent</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item name="journal" label="Journal / Conference / Patent">
            <Input placeholder="저널명 또는 학회명" />
          </Form.Item>

          <Form.Item name="volume" label="Volume / Issue">
            <Input placeholder="Vol.12, No.3" />
          </Form.Item>

          <Form.Item name="link" label="DOI / Link">
            <Input placeholder="https://doi.org/..." />
          </Form.Item>

          <Form.Item name="abstract" label="Abstract (선택)">
            <TextArea rows={4} placeholder="논문 초록" />
          </Form.Item>

          <Divider />

          <Space size="large">
            <Form.Item name="isSelected" valuePropName="checked" label="Selected Publications">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>

            <Form.Item name="isWorkInProgress" valuePropName="checked" label="Work In Progress">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>

            <Form.Item name="isActive" valuePropName="checked" label="활성화">
              <Switch checkedChildren="활성" unCheckedChildren="비활성" />
            </Form.Item>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
