import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form, Input, Select, Button, Card, Upload, message, Space,
  Typography, Switch, InputNumber, Modal, Spin, Divider
} from 'antd';
import {
  UploadOutlined, SaveOutlined, EyeOutlined, ArrowLeftOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { API_CONFIG } from '../../../config/api';

const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function CourseForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const autoSaveTimer = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // 데이터 로드 (수정 모드)
  useEffect(() => {
    if (isEdit) {
      fetchCourse();
    }
  }, [id]);

  // 자동 저장 (5분마다)
  useEffect(() => {
    if (hasChanges && isEdit) {
      autoSaveTimer.current = setTimeout(() => {
        handleAutoSave();
      }, 5 * 60 * 1000);
    }

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [hasChanges, form]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/courses/${id}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        form.setFieldsValue(data.data);
        setImageUrl(data.data.image);
      } else {
        message.error('강의 정보를 불러오는데 실패했습니다.');
        navigate('/admin/courses');
      }
    } catch (err) {
      message.error('서버 오류');
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    if (!isEdit) return;

    try {
      const values = form.getFieldsValue();
      values.image = imageUrl;

      await fetch(`${API_CONFIG.BASE_URL}/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      });

      setLastSaved(new Date());
      setHasChanges(false);
    } catch (err) {
      console.error('Auto save failed:', err);
    }
  };

  const onFinish = async (values) => {
    if (!imageUrl) {
      message.error('강의 이미지를 업로드해주세요.');
      return;
    }

    setSaving(true);
    values.image = imageUrl;

    try {
      const url = isEdit
        ? `${API_CONFIG.BASE_URL}/api/courses/${id}`
        : `${API_CONFIG.BASE_URL}/api/courses`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      });

      const data = await res.json();

      if (data.success) {
        message.success(isEdit ? '강의가 수정되었습니다.' : '강의가 추가되었습니다.');
        navigate('/admin/courses');
      } else {
        message.error(data.message);
      }
    } catch (err) {
      message.error('저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const uploadProps = {
    name: 'image',
    action: `${API_CONFIG.BASE_URL}${API_CONFIG.COURSES.UPLOAD_IMAGE}`,
    withCredentials: true,
    accept: 'image/*',
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        setImageUrl(info.file.response.url);
        setHasChanges(true);
        message.success('이미지가 업로드되었습니다.');
      } else if (info.file.status === 'error') {
        message.error('이미지 업로드 실패');
      }
    }
  };

  const handleValuesChange = () => {
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/courses')}
          >
            목록으로
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            {isEdit ? '강의 수정' : '강의 추가'}
          </Title>
        </Space>

        <Space>
          {lastSaved && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              자동 저장됨: {lastSaved.toLocaleTimeString('ko-KR')}
            </Text>
          )}
          <Button
            icon={<EyeOutlined />}
            onClick={() => setPreviewVisible(true)}
            disabled={!imageUrl}
          >
            미리보기
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={() => form.submit()}
          >
            저장
          </Button>
        </Space>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={handleValuesChange}
          initialValues={{
            isActive: true,
            order: 0
          }}
        >
          <Form.Item
            name="name"
            label="강의명"
            rules={[{ required: true, message: '강의명을 입력해주세요' }]}
          >
            <Input placeholder="Database Systems" />
          </Form.Item>

          <Form.Item
            name="university"
            label="University"
            rules={[{ required: true, message: 'University를 선택해주세요' }]}
          >
            <Select placeholder="선택하세요">
              <Select.Option value="Hanyang">Hanyang University</Select.Option>
              <Select.Option value="SNU">Seoul National University</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="term"
            label="Term"
            rules={[{ required: true, message: 'Term을 선택해주세요' }]}
          >
            <Select placeholder="선택하세요">
              <Select.Option value="Spring">Spring</Select.Option>
              <Select.Option value="Fall">Fall</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="grad"
            label="Level"
            rules={[{ required: true, message: 'Level을 선택해주세요' }]}
          >
            <Select placeholder="선택하세요">
              <Select.Option value="Undergraduate">Undergraduate</Select.Option>
              <Select.Option value="Graduate">Graduate</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="year"
            label="Year(s)"
            rules={[{ required: true, message: 'Year를 입력해주세요' }]}
            extra="여러 해에 강의한 경우 쉼표로 구분 (예: 2024, 2025, 2026)"
          >
            <Input placeholder="2024, 2025, 2026" />
          </Form.Item>

          <Form.Item
            name="link"
            label="강의계획서 Link (선택)"
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Divider />

          {/* 이미지 업로드 */}
          <Form.Item label="강의 이미지" required>
            <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
              {imageUrl ? (
                <img
                  src={imageUrl.startsWith('http') ? imageUrl : `${API_CONFIG.BASE_URL}${imageUrl}`}
                  alt="preview"
                  style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain' }}
                />
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    클릭하거나 드래그하여 이미지 업로드
                  </p>
                  <p className="ant-upload-hint">
                    JPG, PNG, WebP 형식 (최대 5MB)
                  </p>
                </>
              )}
            </Dragger>
          </Form.Item>

          <Divider />

          <Form.Item
            name="order"
            label="정렬 순서"
            extra="낮은 숫자가 먼저 표시됩니다"
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="활성화"
            valuePropName="checked"
          >
            <Switch checkedChildren="활성" unCheckedChildren="비활성" />
          </Form.Item>
        </Form>
      </Card>

      {/* 미리보기 모달 */}
      <Modal
        title="미리보기"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={400}
      >
        <div style={{
          width: '100%',
          height: 200,
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
          backgroundImage: `url(${imageUrl?.startsWith('http') ? imageUrl : `${API_CONFIG.BASE_URL}${imageUrl}`})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: 'white'
          }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>
              {form.getFieldValue('name') || 'Course Name'}
            </h3>
            <div style={{ marginTop: 8 }}>
              <span style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: '#1890ff',
                borderRadius: 4,
                fontSize: 12,
                marginRight: 4
              }}>
                {form.getFieldValue('term') || 'Term'}
              </span>
              <span style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: '#52c41a',
                borderRadius: 4,
                fontSize: 12
              }}>
                {form.getFieldValue('grad') === 'Undergraduate' ? 'UG' : 'Grad'}
              </span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 12, opacity: 0.9 }}>
              {form.getFieldValue('year') || 'Year'}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
