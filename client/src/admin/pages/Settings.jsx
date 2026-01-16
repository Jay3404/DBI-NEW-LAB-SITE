import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Form, Input, Button, message, Space, Typography,
  Divider, Descriptions, Tag, Popconfirm, Spin, Alert
} from 'antd';
import {
  MailOutlined, KeyOutlined, LogoutOutlined,
  ReloadOutlined, SendOutlined, SaveOutlined
} from '@ant-design/icons';
import { API_CONFIG } from '../../config/api';

const { Title, Text } = Typography;

export default function Settings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [keyInfo, setKeyInfo] = useState(null);

  const navigate = useNavigate();

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/admin/settings`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        form.setFieldsValue({
          professorEmail: data.data.email.professorEmail,
          adminEmail: data.data.email.adminEmail
        });
        setKeyInfo(data.data.keyInfo);
      } else {
        message.error('설정을 불러오는데 실패했습니다.');
      }
    } catch {
      message.error('서버 오류');
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveEmail = async (values) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/admin/settings/email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      });
      const data = await res.json();

      if (data.success) {
        message.success('이메일 설정이 저장되었습니다.');
      } else {
        message.error(data.message);
      }
    } catch {
      message.error('저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const handleRotateKey = async () => {
    setRotating(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/admin/rotate-key`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        message.success('Key가 갱신되었습니다. 새 Key가 이메일로 발송됩니다.');
        // 세션이 무효화되므로 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      } else {
        message.error(data.message);
      }
    } catch {
      message.error('Key 갱신 실패');
    } finally {
      setRotating(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/admin/settings/test-email`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        message.success('테스트 이메일이 발송되었습니다.');
      } else {
        message.error(data.message);
      }
    } catch {
      message.error('이메일 발송 실패');
    } finally {
      setTestingEmail(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_CONFIG.BASE_URL}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      message.success('로그아웃 되었습니다.');
      navigate('/admin/login');
    } catch {
      message.error('로그아웃 실패');
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
    <div style={{ maxWidth: 800 }}>
      <Title level={4}>Settings</Title>

      {/* Key 정보 섹션 */}
      <Card
        title={<><KeyOutlined /> Admin Key 정보</>}
        style={{ marginBottom: 24 }}
      >
        {keyInfo && (
          <>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Key Version">
                <Tag color="blue">v{keyInfo.version}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="현재 분기">
                <Tag color="green">{keyInfo.quarter}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="만료일">
                <Text>
                  {new Date(keyInfo.expiresAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Alert
              message="Key는 분기별 (1월, 4월, 7월, 10월 1일)에 자동으로 갱신됩니다."
              type="info"
              showIcon
              style={{ marginTop: 16, marginBottom: 16 }}
            />

            <Popconfirm
              title="Key를 지금 갱신하시겠습니까?"
              description="갱신 후 새 Key가 이메일로 발송되며, 현재 세션은 종료됩니다."
              onConfirm={handleRotateKey}
              okText="갱신"
              cancelText="취소"
              okButtonProps={{ danger: true }}
            >
              <Button
                icon={<ReloadOutlined />}
                loading={rotating}
                danger
              >
                Key 수동 갱신
              </Button>
            </Popconfirm>
          </>
        )}
      </Card>

      {/* 이메일 설정 섹션 */}
      <Card
        title={<><MailOutlined /> 이메일 알림 설정</>}
        style={{ marginBottom: 24 }}
      >
        <Alert
          message="Key 갱신 시 아래 이메일 주소로 새 Key가 발송됩니다."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveEmail}
        >
          <Form.Item
            name="professorEmail"
            label="교수님 이메일"
            rules={[
              { type: 'email', message: '올바른 이메일 형식을 입력해주세요' }
            ]}
          >
            <Input
              placeholder="professor@hanyang.ac.kr"
              prefix={<MailOutlined />}
              style={{ maxWidth: 400 }}
            />
          </Form.Item>

          <Form.Item
            name="adminEmail"
            label="관리자 이메일"
            rules={[
              { type: 'email', message: '올바른 이메일 형식을 입력해주세요' }
            ]}
          >
            <Input
              placeholder="admin@hanyang.ac.kr"
              prefix={<MailOutlined />}
              style={{ maxWidth: 400 }}
            />
          </Form.Item>

          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
            >
              저장
            </Button>
            <Button
              icon={<SendOutlined />}
              loading={testingEmail}
              onClick={handleTestEmail}
            >
              테스트 이메일 발송
            </Button>
          </Space>
        </Form>
      </Card>

      {/* 계정 섹션 */}
      <Card title="계정">
        <Popconfirm
          title="로그아웃 하시겠습니까?"
          onConfirm={handleLogout}
          okText="로그아웃"
          cancelText="취소"
        >
          <Button icon={<LogoutOutlined />} danger>
            로그아웃
          </Button>
        </Popconfirm>
      </Card>

      <Divider />

      <Text type="secondary" style={{ fontSize: 12 }}>
        DBI Lab Admin Panel v1.0
      </Text>
    </div>
  );
}
