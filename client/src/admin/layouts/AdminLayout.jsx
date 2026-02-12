import { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, message, Spin } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  ProjectOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { API_CONFIG } from '../../config/api';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [keyInfo, setKeyInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 세션 확인
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ADMIN.SESSION}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (!data.isLoggedIn) {
        navigate('/admin/login');
        return;
      }

      setKeyInfo(data.keyInfo);
    } catch (err) {
      console.error('Session check failed:', err);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ADMIN.LOGOUT}`, {
        method: 'POST',
        credentials: 'include'
      });
      message.success('로그아웃 되었습니다.');
      navigate('/admin/login');
    } catch (err) {
      message.error('로그아웃 실패');
    }
  };

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: '/admin/courses',
      icon: <BookOutlined />,
      label: <Link to="/admin/courses">Courses</Link>,
    },
    {
      key: '/admin/publications',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/publications">Publications</Link>,
    },
    {
      key: '/admin/members',
      icon: <TeamOutlined />,
      label: <Link to="/admin/members">Members</Link>,
    },
    {
      key: '/admin/projects',
      icon: <ProjectOutlined />,
      label: <Link to="/admin/projects">Projects</Link>,
    },
    {
      key: '/admin/news',
      icon: <NotificationOutlined />,
      label: <Link to="/admin/news">News</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Settings</Link>,
    },
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? 14 : 18,
          fontWeight: 'bold'
        }}>
          {collapsed ? 'DBI' : 'DBI Lab Admin'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {keyInfo && (
              <span style={{ color: '#888', fontSize: 12 }}>
                Key expires: {new Date(keyInfo.expiresAt).toLocaleDateString('ko-KR')}
              </span>
            )}
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Header>

        <Content style={{
          margin: 24,
          padding: 24,
          background: '#fff',
          borderRadius: 8,
          minHeight: 280,
          overflow: 'auto',
          maxHeight: 'calc(100vh - 112px)'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
