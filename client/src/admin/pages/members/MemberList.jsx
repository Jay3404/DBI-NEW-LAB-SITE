import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Button, Space, Tag, message, Popconfirm, Select, Card,
  Typography, Row, Col, Avatar
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  ReloadOutlined, UserOutlined
} from '@ant-design/icons';
import { API_CONFIG } from '../../../config/api';

const { Title } = Typography;

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    isAlumni: ''
  });
  const navigate = useNavigate();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.isAlumni) params.append('isAlumni', filters.isAlumni);
      params.append('active', 'false');

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/members?${params}`,
        { credentials: 'include' }
      );
      const data = await res.json();

      if (data.success) {
        setMembers(data.data);
      }
    } catch {
      message.error('멤버 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/members/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        message.success('멤버가 삭제되었습니다.');
        fetchMembers();
      }
    } catch {
      message.error('삭제 실패');
    }
  };

  const roleColors = {
    'Professor': 'gold',
    'Research Professor': 'orange',
    'PhD': 'blue',
    'MS': 'green',
    'BS': 'cyan',
    'Visiting': 'purple',
    'Alumni': 'default'
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 60,
      render: (image) => (
        <Avatar
          src={image ? `${API_CONFIG.BASE_URL}${image}` : null}
          icon={!image && <UserOutlined />}
        />
      )
    },
    {
      title: 'Name',
      key: 'name',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.name}</div>
          {record.nameKo && <div style={{ color: '#888', fontSize: 12 }}>{record.nameKo}</div>}
        </div>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => (
        <Tag color={roleColors[role] || 'default'}>{role}</Tag>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Join Year',
      dataIndex: 'joinYear',
      key: 'joinYear',
      width: 90
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
            onClick={() => navigate(`/admin/members/edit/${record._id}`)}
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
        <Title level={4} style={{ margin: 0 }}>Members 관리</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/members/new')}
        >
          멤버 추가
        </Button>
      </div>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Space>
              <span>Role:</span>
              <Select
                allowClear
                placeholder="All"
                style={{ width: 150 }}
                value={filters.role || undefined}
                onChange={(v) => setFilters(prev => ({ ...prev, role: v || '' }))}
                options={[
                  { value: 'Professor', label: 'Professor' },
                  { value: 'Research Professor', label: 'Research Professor' },
                  { value: 'PhD', label: 'PhD' },
                  { value: 'MS', label: 'MS' },
                  { value: 'BS', label: 'BS' },
                  { value: 'Visiting', label: 'Visiting' },
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <span>Alumni:</span>
              <Select
                allowClear
                placeholder="All"
                style={{ width: 100 }}
                value={filters.isAlumni || undefined}
                onChange={(v) => setFilters(prev => ({ ...prev, isAlumni: v || '' }))}
                options={[
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' },
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={fetchMembers}>
              새로고침
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={members}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}명`
        }}
        size="small"
      />
    </div>
  );
}
