import { useState, useEffect, useCallback } from 'react';
import { LinkedinOutlined, IdcardOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { API_CONFIG } from '../config/api';
import '../styles/Members.css';

export default function Researchers() {
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResearchers = useCallback(async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/members?role=Visiting&isAlumni=false`);
      const data = await res.json();
      if (data.success) {
        setResearchers(data.data);
      }
    } catch {
      console.error('Failed to load researchers data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResearchers();
  }, [fetchResearchers]);

  if (loading) {
    return (
      <div className="member-container" style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="member-container">
      {/* Header Section */}
      <div className="member-header">
        <h1 className="lab-members-title">Lab Members</h1>
        <h2 className="current-category">Researchers</h2>
      </div>

      {/* Main Content */}
      <div className="member-main-content">
        {/* Researchers Section */}
        <div className="researchers-section">
          {researchers.map((researcher) => (
            <div key={researcher._id} className="researcher-profile">
              <div className="profile-image-container">
                {researcher.image ? (
                  <img src={`${API_CONFIG.BASE_URL}${researcher.image}`} alt={researcher.name} className="profile-image" />
                ) : (
                  <img src="/src/assets/default_profile.png" alt={researcher.name} className="profile-image" />
                )}
              </div>

              <div className="profile-info">
                <h1 className="member-name">{researcher.name}<br/>({researcher.nameKo})</h1>
                <p className="member-title">{researcher.title}</p>

                <div className="divider"></div>

                <div className="affiliation-info">
                  <p className="affiliation-item">Hanyang University</p>
                  <p className="affiliation-item">Data and Business Intelligence Lab</p>
                  <p className="affiliation-item">Department of Information Systems</p>
                </div>

                {researcher.secondaryTitle && (
                  <>
                    <br />
                    <p className="member-title">{researcher.secondaryTitle}</p>
                    <div className="divider"></div>
                    <div className="affiliation-info">
                      {researcher.secondaryAffiliation && researcher.secondaryAffiliation.split(', ').map((line, idx) => (
                        <p key={idx} className="affiliation-item">{line}</p>
                      ))}
                    </div>
                  </>
                )}

                <div className="contact-section">
                  <h3 className="contact-title">Contact</h3>
                  <div className="contact-icons">
                    {researcher.linkedin && (
                      <a href={researcher.linkedin} target="_blank" rel="noopener noreferrer" className="contact-icon linkedin">
                        <LinkedinOutlined />
                      </a>
                    )}
                    {researcher.orcid && (
                      <a href={researcher.orcid} target="_blank" rel="noopener noreferrer" className="contact-icon orcid">
                        <IdcardOutlined />
                      </a>
                    )}
                  </div>
                  <p className="email">Email: {researcher.email}</p>
                </div>
              </div>
            </div>
          ))}

          {researchers.length === 0 && (
            <p style={{ textAlign: 'center', padding: 50 }}>No researchers data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
