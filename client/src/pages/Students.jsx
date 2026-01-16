import { useState, useEffect, useCallback } from 'react';
import { GithubOutlined, IdcardOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { API_CONFIG } from '../config/api';
import '../styles/Members.css';

export default function Students() {
  const [phdStudents, setPhdStudents] = useState([]);
  const [msStudents, setMsStudents] = useState([]);
  const [bsStudents, setBsStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    try {
      // Fetch PhD and MS, BS students
      const [phdRes, msRes, bsRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/api/members?role=PhD`),
        fetch(`${API_CONFIG.BASE_URL}/api/members?role=MS`),
        fetch(`${API_CONFIG.BASE_URL}/api/members?role=BS`)
      ]);

      const phdData = await phdRes.json();
      const msData = await msRes.json();
      const bsData = await bsRes.json();    

      if (phdData.success) {
        setPhdStudents(phdData.data);
      }
      if (msData.success) {
        setMsStudents(msData.data);
      }
      if (bsData.success) {
        setBsStudents(bsData.data);
      }
    } catch {
      console.error('Failed to load students data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  if (loading) {
    return (
      <div className="member-container" style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  const renderStudentCard = (student) => (
    <div key={student._id} className="student-profile">
      <div className="profile-image-container">
        {student.image ? (
          <img src={`${API_CONFIG.BASE_URL}${student.image}`} alt={student.name} className="profile-image" />
        ) : (
          <img src="/src/assets/default_profile.png" alt={student.name} className="profile-image" />
        )}
      </div>

      <div className="profile-info">
        <h1 className="member-name">{student.name} ({student.nameKo})</h1>
        {student.isLabManager && <p className="student-role">Lab Manager</p>}
        <div className="info-switch-container">
          <p className="email">{student.email}</p>
          {student.researchKeyword && <p className="student-research-keyword">{student.researchKeyword}</p>}
          {student.researchFocus && <p className="student-research-focus">{student.researchFocus}</p>}
        </div>
      </div>

      <div className="contact-icons">
        {student.github && (
          <a href={student.github} target="_blank" rel="noopener noreferrer" className="contact-icon github">
            <GithubOutlined />
          </a>
        )}
        {student.orcid && (
          <a href={student.orcid} target="_blank" rel="noopener noreferrer" className="contact-icon orcid">
            <IdcardOutlined />
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="member-container">
      {/* Header Section */}
      <div className="member-header">
        <h1 className="lab-members-title">Lab Members</h1>
        <h2 className="current-category">Students</h2>
      </div>

      {/* Main Content */}
      <div className="member-main-content">
        {/* Students Section */}
        <div className="students-section">
          {/* Ph.D. / Integrated Ph.D. Program */}
          {phdStudents.length > 0 && (
            <div className="student-category">
              <h3 className="category-title">Ph.D. / Integrated Ph.D. Program</h3>
              <div className="students-grid">
                {phdStudents.map(renderStudentCard)}
              </div>
            </div>
          )}

          {/* Master's Program */}
          {msStudents.length > 0 && (
            <div className="student-category">
              <h3 className="category-title">Master's Program</h3>
              <div className="students-grid">
                {msStudents.map(renderStudentCard)}
              </div>
            </div>
          )}
          {/* Bachelor's Program */}
          {bsStudents.length > 0 && (
            <div className="student-category">
              <h3 className="category-title">Undergraduate Internship</h3>
              <div className="students-grid">
                {bsStudents.map(renderStudentCard)}
              </div>
            </div>
          )}

          {phdStudents.length === 0 && msStudents.length === 0 && bsStudents.length === 0 && (
            <p style={{ textAlign: 'center', padding: 50 }}>No students data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
