import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Typography, Tag, Spin } from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { API_CONFIG } from '../../config/api';

const { Title, Text } = Typography;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    courses: 0,
    publications: 0,
    members: 0,
    projects: 0
  });
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 헬스 체크
      const healthRes = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.HEALTH}`);
      const healthData = await healthRes.json();
      setServerStatus(healthData);

      // Courses 개수
      const coursesRes = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.COURSES.LIST}`, {
        credentials: 'include'
      });
      const coursesData = await coursesRes.json();

      setStats(prev => ({
        ...prev,
        courses: coursesData.count || 0
      }));

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const recentActivities = [
    { action: '시스템 시작', time: '방금', type: 'system' },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>Dashboard</Title>

      {/* 통계 카드 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Courses"
              value={stats.courses}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Publications"
              value={stats.publications}
              prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Members"
              value={stats.members}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Projects"
              value={stats.projects}
              prefix={<ProjectOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 시스템 상태 */}
        <Col xs={24} lg={12}>
          <Card title="시스템 상태">
            {serverStatus && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text>서버 상태</Text>
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Online
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text>MongoDB</Text>
                  <Tag color={serverStatus.mongodb === 'connected' ? 'success' : 'error'}>
                    {serverStatus.mongodb === 'connected' ? 'Connected' : 'Disconnected'}
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>마지막 확인</Text>
                  <Text type="secondary">
                    {new Date(serverStatus.timestamp).toLocaleString('ko-KR')}
                  </Text>
                </div>
              </div>
            )}
          </Card>
        </Col>

        {/* 최근 활동 */}
        <Col xs={24} lg={12}>
          <Card title="최근 활동">
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<ClockCircleOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
                    title={item.action}
                    description={item.time}
                  />
                </List.Item>
              )}
              locale={{ emptyText: '최근 활동이 없습니다.' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 빠른 작업 */}
      <Card title="빠른 작업" style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Card
              hoverable
              size="small"
              onClick={() => window.location.href = '/admin/courses/new'}
            >
              <div style={{ textAlign: 'center' }}>
                <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <div style={{ marginTop: 8 }}>강의 추가</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card hoverable size="small">
              <div style={{ textAlign: 'center' }}>
                <FileTextOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <div style={{ marginTop: 8 }}>논문 추가</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card hoverable size="small">
              <div style={{ textAlign: 'center' }}>
                <TeamOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                <div style={{ marginTop: 8 }}>멤버 추가</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card hoverable size="small">
              <div style={{ textAlign: 'center' }}>
                <ProjectOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                <div style={{ marginTop: 8 }}>프로젝트 추가</div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
