import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Button, Space, Tag, message, Popconfirm, Select, Card,
  Typography, Row, Col
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  ReloadOutlined, StarOutlined, StarFilled
} from '@ant-design/icons';
import { API_CONFIG } from '../../../config/api';

const { Title } = Typography;

export default function PublicationList() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: '',
    category: '',
    type: '',
    isSelected: ''
  });
  const navigate = useNavigate();

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.year) params.append('year', filters.year);
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);
      if (filters.isSelected) params.append('isSelected', filters.isSelected);
      params.append('active', 'false');

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/publications?${params}`,
        { credentials: 'include' }
      );
      const data = await res.json();

      if (data.success) {
        setPublications(data.data);
      }
    } catch {
      message.error('논문 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/publications/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        message.success('논문이 삭제되었습니다.');
        fetchPublications();
      }
    } catch {
      message.error('삭제 실패');
    }
  };

  const handleToggleSelected = async (record) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/publications/${record._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isSelected: !record.isSelected })
      });
      const data = await res.json();

      if (data.success) {
        message.success(record.isSelected ? 'Selected 해제' : 'Selected 설정');
        fetchPublications();
      }
    } catch {
      message.error('변경 실패');
    }
  };

  const categoryColors = {
    'SCI': 'blue',
    'SSCI': 'purple',
    'SCI/SSCI': 'geekblue',
    'KCI': 'green',
    'Scopus': 'cyan',
    'KR Patent': 'orange',
    'US Patent': 'gold',
    'Other': 'default'
  };

  const columns = [
    {
      title: '',
      key: 'selected',
      width: 40,
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          icon={record.isSelected ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
          onClick={() => handleToggleSelected(record)}
        />
      )
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: 70,
      sorter: (a, b) => b.year - a.year
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title, record) => (
        <a href={record.link} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      )
    },
    {
      title: 'Authors',
      dataIndex: 'authors',
      key: 'authors',
      width: 200,
      ellipsis: true,
      render: (authors) => authors?.join(', ')
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category) => (
        <Tag color={categoryColors[category] || 'default'}>{category}</Tag>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 90,
      render: (type) => <Tag>{type}</Tag>
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
            onClick={() => navigate(`/admin/publications/edit/${record._id}`)}
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

  // 연도 옵션 생성
  const yearOptions = [...new Set(publications.map(p => p.year))]
    .sort((a, b) => b - a)
    .map(year => ({ value: year, label: year }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Publications 관리</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/publications/new')}
        >
          논문 추가
        </Button>
      </div>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Space>
              <span>Year:</span>
              <Select
                allowClear
                placeholder="All"
                style={{ width: 100 }}
                options={yearOptions}
                value={filters.year || undefined}
                onChange={(v) => setFilters(prev => ({ ...prev, year: v || '' }))}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <span>Category:</span>
              <Select
                allowClear
                placeholder="All"
                style={{ width: 120 }}
                value={filters.category || undefined}
                onChange={(v) => setFilters(prev => ({ ...prev, category: v || '' }))}
                options={[
                  { value: 'SCI', label: 'SCI' },
                  { value: 'SSCI', label: 'SSCI' },
                  { value: 'SCI/SSCI', label: 'SCI/SSCI' },
                  { value: 'KCI', label: 'KCI' },
                  { value: 'Scopus', label: 'Scopus' },
                  { value: 'KR Patent', label: 'KR Patent' },
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <span>Type:</span>
              <Select
                allowClear
                placeholder="All"
                style={{ width: 120 }}
                value={filters.type || undefined}
                onChange={(v) => setFilters(prev => ({ ...prev, type: v || '' }))}
                options={[
                  { value: 'Journal', label: 'Journal' },
                  { value: 'Conference', label: 'Conference' },
                  { value: 'Patent', label: 'Patent' },
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <span>Selected:</span>
              <Select
                allowClear
                placeholder="All"
                style={{ width: 100 }}
                value={filters.isSelected || undefined}
                onChange={(v) => setFilters(prev => ({ ...prev, isSelected: v || '' }))}
                options={[
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' },
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={fetchPublications}>
              새로고침
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={publications}
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
