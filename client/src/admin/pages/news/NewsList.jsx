import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Button, Space, Tag, message, Popconfirm, Card,
  Typography, Row, Col, Switch
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  ReloadOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { API_CONFIG } from '../../../config/api';

const { Title } = Typography;

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('active', 'false');

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/news?${params}`,
        { credentials: 'include' }
      );
      const data = await res.json();

      if (data.success) {
        setNews(data.data);
      }
    } catch (err) {
      message.error('뉴스 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/news/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        message.success('뉴스가 삭제되었습니다.');
        fetchNews();
      }
    } catch (err) {
      message.error('삭제 실패');
    }
  };

  const handleToggleUrgent = async (record) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/news/${record._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isUrgent: !record.isUrgent })
      });
      const data = await res.json();

      if (data.success) {
        message.success(record.isUrgent ? '긴급 해제' : '긴급 설정');
        fetchNews();
      }
    } catch (err) {
      message.error('변경 실패');
    }
  };

  const handleToggleActive = async (record) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/news/${record._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !record.isActive })
      });
      const data = await res.json();

      if (data.success) {
        message.success(record.isActive ? '비활성화' : '활성화');
        fetchNews();
      }
    } catch (err) {
      message.error('변경 실패');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const columns = [
    {
      title: '',
      key: 'urgent',
      width: 40,
      render: (_, record) => (
        record.isUrgent && <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
      )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 110,
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(b.date) - new Date(a.date)
    },
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
      title: 'Urgent',
      dataIndex: 'isUrgent',
      key: 'isUrgent',
      width: 80,
      render: (isUrgent, record) => (
        <Switch
          checked={isUrgent}
          size="small"
          onChange={() => handleToggleUrgent(record)}
        />
      )
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
            onClick={() => navigate(`/admin/news/edit/${record._id}`)}
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
        <Title level={4} style={{ margin: 0 }}>News 관리</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchNews}>
            새로고침
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/news/new')}
          >
            뉴스 추가
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={news}
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
