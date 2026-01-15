import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Button, Space, Tag, message, Popconfirm, Select, Card,
  Typography, Row, Col, Switch
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { API_CONFIG } from '../../../config/api';

const { Title } = Typography;

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      params.append('active', 'false');

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/projects?${params}`,
        { credentials: 'include' }
      );
      const data = await res.json();

      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      message.error('프로젝트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        message.success('프로젝트가 삭제되었습니다.');
        fetchProjects();
      }
    } catch (err) {
      message.error('삭제 실패');
    }
  };

  const handleToggleActive = async (record) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/projects/${record._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !record.isActive })
      });
      const data = await res.json();

      if (data.success) {
        message.success(record.isActive ? '비활성화' : '활성화');
        fetchProjects();
      }
    } catch (err) {
      message.error('변경 실패');
    }
  };

  const statusColors = {
    'Ongoing': 'processing',
    'Completed': 'success',
    'Work In Progress': 'warning'
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title, record) => (
        record.link ? (
          <a href={record.link} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        ) : title
      )
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      width: 120
    },
    {
      title: 'Sponsor',
      dataIndex: 'sponsor',
      key: 'sponsor',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>{status}</Tag>
      )
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      width: 150,
      ellipsis: true,
      render: (members) => members?.map(m => m.name).join(', ') || '-'
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          size="small"
          onChange={() => handleToggleActive(record)}
        />
      )
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/projects/edit/${record._id}`)}
          />
          <Popconfirm
            title="삭제하시겠습니까?"
            onConfirm={() => handleDelete(record._id)}
            okText="삭제"
            cancelText="취소"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Projects 관리</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/projects/new')}
        >
          프로젝트 추가
        </Button>
      </div>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Space>
              <span>Status:</span>
              <Select
                allowClear
                placeholder="All"
                style={{ width: 160 }}
                value={filters.status || undefined}
                onChange={(v) => setFilters(prev => ({ ...prev, status: v || '' }))}
                options={[
                  { value: 'Ongoing', label: 'Ongoing' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'Work In Progress', label: 'Work In Progress' },
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={fetchProjects}>
              새로고침
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={projects}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}개`
        }}
        size="small"
      />
    </div>
  );
}
