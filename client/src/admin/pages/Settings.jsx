import { useNavigate } from 'react-router-dom';
import { Card, Button, message, Typography, Divider, Popconfirm } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { API_CONFIG } from '../../config/api';

const { Title, Text } = Typography;

export default function Settings() {
  const navigate = useNavigate();

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

  return (
    <div style={{ maxWidth: 800 }}>
      <Title level={4}>Settings</Title>

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
