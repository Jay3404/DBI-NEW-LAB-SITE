import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { API_CONFIG } from '../../config/api';

const { Title, Text } = Typography;

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ADMIN.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: values.password })
      });

      const data = await res.json();

      if (data.success) {
        message.success('로그인 성공!');
        navigate('/admin');
      } else {
        message.error(data.message || '로그인 실패');
      }
    } catch (err) {
      console.error('Login error:', err);
      message.error('서버 연결 실패. 서버가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          borderRadius: 12
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64,
            height: 64,
            background: '#1890ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <LockOutlined style={{ fontSize: 28, color: 'white' }} />
          </div>
          <Title level={3} style={{ marginBottom: 8 }}>DBI Lab Admin</Title>
          <Text type="secondary">관리자 패스워드를 입력하세요</Text>
        </div>

        <Form
          name="admin-login"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '패스워드를 입력해주세요' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              autoFocus
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: 48 }}
            >
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
