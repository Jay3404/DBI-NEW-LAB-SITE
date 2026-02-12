import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Button, Space, Tag, Image, message, Popconfirm, Input, Select,
  Card, Typography, Row, Col
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { API_CONFIG } from '../../../config/api';

const { Title } = Typography;

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    university: 'All',
    term: 'All',
    grad: 'All'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.university !== 'All') params.append('university', filters.university);
      if (filters.term !== 'All') params.append('term', filters.term);
      if (filters.grad !== 'All') params.append('grad', filters.grad);
      params.append('active', 'false'); // 관리자는 비활성화된 것도 조회

      const res = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.COURSES.LIST}?${params}`,
        { credentials: 'include' }
      );
      const data = await res.json();

      if (data.success) {
        setCourses(data.data);
      } else {
        message.error(data.message);
      }
    } catch (err) {
      console.error('Fetch courses error:', err);
      message.error('강의 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/courses/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        message.success('강의가 삭제되었습니다.');
        fetchCourses();
      } else {
        message.error(data.message);
      }
    } catch (err) {
      message.error('삭제 실패');
    }
  };

  const columns = [
    {
      title: '이미지',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (image) => (
        <Image
          src={image?.startsWith('http') ? image : `${API_CONFIG.BASE_URL}${image}`}
          alt="course"
          width={100}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN88R8AAtUB6S/lfiQAAAAASUVORK5CYII="
        />
      )
    },
    {
      title: '강의명',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'University',
      dataIndex: 'university',
      key: 'university',
      width: 120,
      render: (uni) => (
        <Tag color={uni === 'Hanyang' ? 'blue' : 'purple'}>
          {uni}
        </Tag>
      )
    },
    {
      title: 'Term',
      dataIndex: 'term',
      key: 'term',
      width: 100,
      render: (term) => (
        <Tag color={term === 'Spring' ? 'green' : 'orange'}>
          {term}
        </Tag>
      )
    },
    {
      title: 'Level',
      dataIndex: 'grad',
      key: 'grad',
      width: 130,
      render: (grad) => (
        <Tag color={grad === 'Undergraduate' ? 'cyan' : 'magenta'}>
          {grad === 'Undergraduate' ? 'UG' : 'Grad'}
        </Tag>
      )
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: 120
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? '활성' : '비활성'}
        </Tag>
      )
    },
    {
      title: '작업',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/courses/edit/${record._id}`)}
          />
          <Popconfirm
            title="정말 삭제하시겠습니까?"
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
        <Title level={4} style={{ margin: 0 }}>Courses 관리</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/courses/new')}
        >
          강의 추가
        </Button>
      </div>

      {/* 필터 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Space>
              <span>University:</span>
              <Select
                value={filters.university}
                onChange={(v) => setFilters(prev => ({ ...prev, university: v }))}
                style={{ width: 120 }}
                options={[
                  { value: 'All', label: 'All' },
                  { value: 'Hanyang', label: 'Hanyang' },
                  { value: 'SNU', label: 'SNU' }
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <span>Term:</span>
              <Select
                value={filters.term}
                onChange={(v) => setFilters(prev => ({ ...prev, term: v }))}
                style={{ width: 100 }}
                options={[
                  { value: 'All', label: 'All' },
                  { value: 'Spring', label: 'Spring' },
                  { value: 'Fall', label: 'Fall' }
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <span>Level:</span>
              <Select
                value={filters.grad}
                onChange={(v) => setFilters(prev => ({ ...prev, grad: v }))}
                style={{ width: 140 }}
                options={[
                  { value: 'All', label: 'All' },
                  { value: 'Undergraduate', label: 'Undergraduate' },
                  { value: 'Graduate', label: 'Graduate' }
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={fetchCourses}>
              새로고침
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 테이블 */}
      <Table
        columns={columns}
        dataSource={courses}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}개`
        }}
      />
    </div>
  );
}
