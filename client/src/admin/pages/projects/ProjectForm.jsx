import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form, Input, Select, Button, Card, message, Space,
  Typography, Switch, InputNumber, Divider, Spin
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { API_CONFIG } from '../../../config/api';

const { Title } = Typography;
const { TextArea } = Input;

export default function ProjectForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    fetchMembers();
    if (isEdit) {
      fetchProject();
    }
  }, [id]);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/members?active=true`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        setMembers(data.data);
      }
    } catch (err) {
      console.error('멤버 목록 불러오기 실패:', err);
    }
  };

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/projects/${id}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        const projectData = {
          ...data.data,
          members: data.data.members?.map(m => m._id) || []
        };
        form.setFieldsValue(projectData);
      } else {
        message.error('프로젝트 정보를 불러오는데 실패했습니다.');
        navigate('/admin/projects');
      }
    } catch (err) {
      message.error('서버 오류');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSaving(true);

    try {
      const url = isEdit
        ? `${API_CONFIG.BASE_URL}/api/projects/${id}`
        : `${API_CONFIG.BASE_URL}/api/projects`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      });

      const data = await res.json();

      if (data.success) {
        message.success(isEdit ? '프로젝트가 수정되었습니다.' : '프로젝트가 추가되었습니다.');
        navigate('/admin/projects');
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
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/projects')}>
            목록으로
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            {isEdit ? '프로젝트 수정' : '프로젝트 추가'}
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
            status: 'Ongoing',
            isActive: true,
            order: 0
          }}
        >
          <Form.Item
            name="title"
            label="프로젝트 제목"
            rules={[{ required: true, message: '제목을 입력해주세요' }]}
          >
            <TextArea rows={2} placeholder="프로젝트 제목" />
          </Form.Item>

          <Space size="large" wrap>
            <Form.Item name="period" label="기간">
              <Input placeholder="2024-2026" style={{ width: 150 }} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select style={{ width: 160 }}>
                <Select.Option value="Ongoing">Ongoing</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="Work In Progress">Work In Progress</Select.Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item name="sponsor" label="Sponsor / 후원 기관">
            <Input placeholder="NRF, IITP, etc." />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="프로젝트 설명" />
          </Form.Item>

          <Form.Item name="link" label="Link">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="members" label="참여 멤버">
            <Select
              mode="multiple"
              placeholder="멤버 선택"
              optionFilterProp="children"
              style={{ width: '100%' }}
              options={members.map(m => ({
                value: m._id,
                label: `${m.name} (${m.role})`
              }))}
            />
          </Form.Item>

          <Divider />

          <Space size="large">
            <Form.Item name="order" label="Order">
              <InputNumber min={0} placeholder="0" />
            </Form.Item>

            <Form.Item name="isActive" valuePropName="checked" label="Active">
              <Switch checkedChildren="활성" unCheckedChildren="비활성" />
            </Form.Item>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
