import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form, Input, Select, Button, Card, message, Space,
  Typography, Switch, InputNumber, Divider, Spin, Upload, Avatar
} from 'antd';
import {
  SaveOutlined, ArrowLeftOutlined, PlusOutlined,
  MinusCircleOutlined, UploadOutlined, UserOutlined
} from '@ant-design/icons';
import { API_CONFIG } from '../../../config/api';

const { Title } = Typography;
const { TextArea } = Input;

export default function MemberForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const fetchMember = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/members/${id}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        form.setFieldsValue(data.data);
        if (data.data.image) {
          setImageUrl(data.data.image);
        }
      } else {
        message.error('멤버 정보를 불러오는데 실패했습니다.');
        navigate('/admin/members');
      }
    } catch {
      message.error('서버 오류');
      navigate('/admin/members');
    } finally {
      setLoading(false);
    }
  }, [id, form, navigate]);

  useEffect(() => {
    if (isEdit) {
      fetchMember();
    }
  }, [isEdit, fetchMember]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/members/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setImageUrl(data.data.path);
        form.setFieldValue('image', data.data.path);
        message.success('이미지가 업로드되었습니다.');
      } else {
        message.error(data.message || '업로드 실패');
      }
    } catch {
      message.error('업로드 실패');
    } finally {
      setUploading(false);
    }
    return false;
  };

  const onFinish = async (values) => {
    setSaving(true);

    try {
      const url = isEdit
        ? `${API_CONFIG.BASE_URL}/api/members/${id}`
        : `${API_CONFIG.BASE_URL}/api/members`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      });

      const data = await res.json();

      if (data.success) {
        message.success(isEdit ? '멤버가 수정되었습니다.' : '멤버가 추가되었습니다.');
        navigate('/admin/members');
      } else {
        message.error(data.message);
      }
    } catch {
      message.error('저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const role = Form.useWatch('role', form);
  const isAlumni = Form.useWatch('isAlumni', form);

  // Show student-specific fields for PhD, MS, BS
  const isStudent = ['PhD', 'MS', 'BS'].includes(role);
  // Show researcher-specific fields for Visiting
  const isVisiting = role === 'Visiting';
  // Show professor-specific fields
  const isProfessor = role === 'Professor';

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
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/members')}>
            목록으로
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            {isEdit ? '멤버 수정' : '멤버 추가'}
          </Title>
        </Space>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={() => form.submit()}
        >
          저장
        </Button>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            role: 'MS',
            isActive: true,
            isLabManager: false,
            isAlumni: false,
            researchInterests: ['']
          }}
        >
          <Space size="large" align="start">
            <Form.Item label="프로필 이미지">
              <Upload
                name="image"
                showUploadList={false}
                beforeUpload={handleUpload}
                accept="image/*"
              >
                <div style={{ cursor: 'pointer' }}>
                  <Avatar
                    size={100}
                    src={imageUrl ? `${API_CONFIG.BASE_URL}${imageUrl}` : null}
                    icon={!imageUrl && <UserOutlined />}
                  />
                  <div style={{ marginTop: 8, textAlign: 'center' }}>
                    <Button size="small" icon={<UploadOutlined />} loading={uploading}>
                      {uploading ? '업로드 중...' : '이미지 변경'}
                    </Button>
                  </div>
                </div>
              </Upload>
              <Form.Item name="image" hidden>
                <Input />
              </Form.Item>
            </Form.Item>

            <div style={{ flex: 1 }}>
              <Space size="large" wrap>
                <Form.Item
                  name="name"
                  label="Name (English)"
                  rules={[{ required: true, message: '이름을 입력해주세요' }]}
                >
                  <Input placeholder="Gildong Hong" style={{ width: 200 }} />
                </Form.Item>

                <Form.Item name="nameKo" label="Name (Korean)">
                  <Input placeholder="홍길동" style={{ width: 150 }} />
                </Form.Item>

                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true }]}
                >
                  <Select style={{ width: 160 }}>
                    <Select.Option value="Professor">Professor</Select.Option>
                    <Select.Option value="Research Professor">Research Professor</Select.Option>
                    <Select.Option value="PhD">PhD</Select.Option>
                    <Select.Option value="MS">MS</Select.Option>
                    <Select.Option value="BS">Research Internship</Select.Option>
                    <Select.Option value="Visiting">Visiting</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="isAlumni" valuePropName="checked" label="Alumni">
                  <Switch checkedChildren="Yes" unCheckedChildren="No" />
                </Form.Item>
              </Space>
            </div>
          </Space>

          <Divider />

          {/* Title - for Professor and Visiting */}
          {(isProfessor || isVisiting) && (
            <Form.Item name="title" label="Title / Position">
              <Input placeholder="e.g., Assistant Professor (Tenure Track), Visiting Scholar" style={{ maxWidth: 400 }} />
            </Form.Item>
          )}

          <Form.Item name="email" label="Email">
            <Input placeholder="email@example.com" style={{ maxWidth: 300 }} />
          </Form.Item>

          <Form.Item name="affiliation" label="Affiliation">
            <Input placeholder="Hanyang University, Department of Information Systems" style={{ maxWidth: 500 }} />
          </Form.Item>

          {/* Secondary Affiliation - for Visiting Researchers */}
          {isVisiting && (
            <>
              <Divider orientation="left">Secondary Affiliation</Divider>
              <Form.Item name="secondaryTitle" label="Secondary Title">
                <Input placeholder="e.g., Research Professor" style={{ maxWidth: 300 }} />
              </Form.Item>
              <Form.Item name="secondaryAffiliation" label="Secondary Affiliation">
                <Input placeholder="e.g., Institute of IT Convergence Technology, Seoul National University of Science and Technology" style={{ maxWidth: 500 }} />
              </Form.Item>
            </>
          )}

          {/* Student-specific fields */}
          {isStudent && (
            <>
              <Divider orientation="left">Research Info</Divider>
              <Form.Item name="researchKeyword" label="Research Keyword">
                <Input placeholder="e.g., Solutions for Digital Divide" style={{ maxWidth: 400 }} />
              </Form.Item>
              <Form.Item name="researchFocus" label="Research Focus">
                <Input placeholder="e.g., Intelligent Systems, AI Applications" style={{ maxWidth: 400 }} />
              </Form.Item>
              <Form.Item name="isLabManager" valuePropName="checked" label="Lab Manager">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </>
          )}

          {/* Research Interests - for non-students */}
          {!isStudent && (
            <Form.List name="researchInterests">
              {(fields, { add, remove }) => (
                <Form.Item label="Research Interests">
                  {fields.map((field) => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...field}
                        noStyle
                      >
                        <Input placeholder="Research interest" style={{ width: 300 }} />
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      )}
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Interest
                  </Button>
                </Form.Item>
              )}
            </Form.List>
          )}

          <Divider />

          <Space size="large" wrap>
            <Form.Item name="joinYear" label="Join Year">
              <InputNumber min={1990} max={2030} placeholder="2024" />
            </Form.Item>

            {isAlumni && (
              <>
                <Form.Item name="graduationYear" label="Graduation Year">
                  <InputNumber min={1990} max={2030} placeholder="2024" />
                </Form.Item>

                <Form.Item name="currentPosition" label="Current Position">
                  <Input placeholder="e.g., Samsung Card, Google Korea" style={{ width: 300 }} />
                </Form.Item>
              </>
            )}
          </Space>

          <Divider orientation="left">Links</Divider>

          <Form.Item name="website" label="Personal Website">
            <Input placeholder="https://..." style={{ maxWidth: 400 }} />
          </Form.Item>

          <Form.Item name="googleScholar" label="Google Scholar">
            <Input placeholder="https://scholar.google.com/..." style={{ maxWidth: 400 }} />
          </Form.Item>

          <Form.Item name="linkedin" label="LinkedIn">
            <Input placeholder="https://linkedin.com/in/..." style={{ maxWidth: 400 }} />
          </Form.Item>

          <Form.Item name="github" label="GitHub">
            <Input placeholder="https://github.com/..." style={{ maxWidth: 400 }} />
          </Form.Item>

          <Form.Item name="orcid" label="ORCID">
            <Input placeholder="https://orcid.org/..." style={{ maxWidth: 400 }} />
          </Form.Item>

          {/* Professor-specific details */}
          {isProfessor && (
            <>
              <Divider orientation="left">Professional Details (JSON)</Divider>
              <Form.Item
                name="professionalDetails"
                label="Professional Details"
                extra="JSON format: {professionalExperience: [...], affiliations: [...], evaluationRoles: [...], academicService: [...], editorialService: [...], awards: [...]}"
              >
                <TextArea
                  rows={10}
                  placeholder='{"professionalExperience": ["..."], "awards": ["..."]}'
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
            </>
          )}

          <Divider />

          <Space size="large">
            <Form.Item
              name="order"
              label="Order"
              extra="선택사항. 비워두면 자동으로 순서가 지정됩니다."
            >
              <InputNumber min={0} placeholder="Auto" />
            </Form.Item>

            <Form.Item name="isActive" valuePropName="checked" label="Active">
              <Switch checkedChildren="활성" unCheckedChildren="비활성" />
            </Form.Item>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
