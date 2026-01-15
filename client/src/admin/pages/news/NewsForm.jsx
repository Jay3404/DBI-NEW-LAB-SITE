import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form, Input, Button, Card, message, Space,
  Typography, Switch, InputNumber, Divider, Spin, DatePicker
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { API_CONFIG } from '../../../config/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

export default function NewsForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchNews();
    }
  }, [id]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/news/${id}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        const newsData = {
          ...data.data,
          date: data.data.date ? dayjs(data.data.date) : null
        };
        form.setFieldsValue(newsData);
      } else {
        message.error('뉴스 정보를 불러오는데 실패했습니다.');
        navigate('/admin/news');
      }
    } catch (err) {
      message.error('서버 오류');
      navigate('/admin/news');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSaving(true);

    try {
      const payload = {
        ...values,
        date: values.date ? values.date.toISOString() : new Date().toISOString()
      };

      const url = isEdit
        ? `${API_CONFIG.BASE_URL}/api/news/${id}`
        : `${API_CONFIG.BASE_URL}/api/news`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        message.success(isEdit ? '뉴스가 수정되었습니다.' : '뉴스가 추가되었습니다.');
        navigate('/admin/news');
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
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/news')}>
            목록으로
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            {isEdit ? '뉴스 수정' : '뉴스 추가'}
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
            date: dayjs(),
            isUrgent: false,
            isActive: true,
            order: 0
          }}
        >
          <Form.Item
            name="title"
            label="제목"
            rules={[{ required: true, message: '제목을 입력해주세요' }]}
          >
            <Input placeholder="뉴스 제목" />
          </Form.Item>

          <Space size="large" wrap>
            <Form.Item
              name="date"
              label="날짜"
              rules={[{ required: true, message: '날짜를 선택해주세요' }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item name="link" label="Link (선택)">
              <Input placeholder="https://..." style={{ width: 400 }} />
            </Form.Item>
          </Space>

          <Form.Item name="content" label="상세 내용 (선택)">
            <TextArea rows={6} placeholder="뉴스 상세 내용" />
          </Form.Item>

          <Divider />

          <Space size="large">
            <Form.Item name="isUrgent" valuePropName="checked" label="긴급 공지">
              <Switch checkedChildren="긴급" unCheckedChildren="일반" />
            </Form.Item>

            <Form.Item name="order" label="Order">
              <InputNumber min={0} placeholder="0" />
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
