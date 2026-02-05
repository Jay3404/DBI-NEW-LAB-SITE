import { useState, useEffect, useCallback } from 'react';
import { LinkedinOutlined, IdcardOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { API_CONFIG } from '../config/api';
import '../styles/Members.css';

export default function Professor() {
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const fetchProfessor = useCallback(async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/members?role=Professor`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        const prof = data.data[0];
        // Parse professionalDetails if it's a string
        if (prof.professionalDetails && typeof prof.professionalDetails === 'string') {
          try {
            prof.parsedDetails = JSON.parse(prof.professionalDetails);
          } catch {
            prof.parsedDetails = null;
          }
        }
        setProfessor(prof);
      }
    } catch {
      console.error('Failed to load professor data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessor();
  }, [fetchProfessor]);

  if (loading) {
    return (
      <div className="member-container" style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="member-container">
        <div className="member-header">
          <h1 className="lab-members-title">Lab Members</h1>
          <h2 className="current-category">Professor</h2>
        </div>
        <p style={{ textAlign: 'center', padding: 50 }}>No professor data available.</p>
      </div>
    );
  }

  const details = professor.parsedDetails;

  // Helper function to convert text with URLs to clickable links
  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1890ff', textDecoration: 'underline' }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="member-container">
      {/* Header Section */}
      <div className="member-header">
        <h1 className="lab-members-title">Lab Members</h1>
        <h2 className="current-category">Professor</h2>
      </div>

      {/* Main Content */}
      <div className="member-main-content">
        {/* Profile Section */}
        <div className="profile-section">
          {/* Profile Image */}
          <div className="profile-image-container">
            {professor.image ? (
              <img src={`${API_CONFIG.BASE_URL}${professor.image}`} alt={professor.name} className="profile-image" />
            ) : (
              <img src="/src/assets/prof_img.png" alt={professor.name} className="profile-image" />
            )}
          </div>

          {/* Profile Information */}
          <div className="profile-info">
            <h1 className="member-name">{professor.name}<br/>({professor.nameKo})</h1>
            <p className="member-title">{professor.title}</p>

            <div className="divider"></div>

            <div className="affiliation-info">
              <p className="affiliation-item">Hanyang University</p>
              <p className="affiliation-item">Data and Business Intelligence Lab</p>
              <p className="affiliation-item">Department of Information Systems</p>
            </div>

            <div className="contact-section">
              <h3 className="contact-title">Contact</h3>
              <div className="contact-icons">
                {professor.linkedin && (
                  <a href={professor.linkedin} target="_blank" rel="noopener noreferrer" className="contact-icon linkedin">
                    <LinkedinOutlined />
                  </a>
                )}
                {professor.orcid && (
                  <a href={professor.orcid} target="_blank" rel="noopener noreferrer" className="contact-icon orcid">
                    <IdcardOutlined />
                  </a>
                )}
              </div>
              <p className="email">Email: {professor.email}</p>
              <br />

              {details && (
                <div>
                  <Button color='default' variant='outlined' onClick={toggleDetails}>
                    {showDetails ? 'Hide Details' : 'Show Details'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      {showDetails && details && (
        <div className="details-section">
          <div className="details-content">
            <div className="details-text">
              {details.professionalExperience && (
                <>
                  <p><strong>Professional Experience</strong></p>
                  <div style={{ marginLeft: '20px' }}>
                    {details.professionalExperience.map((exp, idx) => (
                      <p key={idx}>• {renderTextWithLinks(exp)}</p>
                    ))}
                  </div>
                </>
              )}

              {details.affiliations && (
                <>
                  <p><strong>Affiliations</strong></p>
                  <div style={{ marginLeft: '20px' }}>
                    {details.affiliations.map((aff, idx) => (
                      <p key={idx}>• {renderTextWithLinks(aff)}</p>
                    ))}
                  </div>
                </>
              )}

              {(details.professionalExperience || details.affiliations) && (
                <p style={{ marginLeft: '20px' }}>
                  <em>*For a more detailed career history, visit my LinkedIn profile.</em>
                </p>
              )}

              {details.evaluationRoles && (
                <>
                  <p><strong>Evaluation & Advisory Roles</strong></p>
                  <div style={{ marginLeft: '20px' }}>
                    {details.evaluationRoles.map((role, idx) => (
                      <p key={idx}>• {role}</p>
                    ))}
                  </div>
                </>
              )}

              {details.academicService && (
                <>
                  <p><strong>Academic & Professional Service</strong></p>
                  <div style={{ marginLeft: '20px' }}>
                    {details.academicService.map((service, idx) => (
                      <p key={idx}>• {service}</p>
                    ))}
                  </div>
                </>
              )}

              {details.editorialService && (
                <>
                  <p><strong>Editorial & Journal Review Service</strong></p>
                  <div style={{ marginLeft: '20px' }}>
                    <p>• Ad-hoc Reviewer for journals published by:</p>
                    <div style={{ marginLeft: '20px' }}>
                      {details.editorialService.map((service, idx) => (
                        <p key={idx}>• {service}</p>
                      ))}
                    </div>
                    <p><em>*A complete list of journals and reviewer activities can be found on my ORCID profile.</em></p>
                  </div>
                </>
              )}

              {details.awards && (
                <>
                  <p><strong>Awards & Honors</strong></p>
                  <div style={{ marginLeft: '20px' }}>
                    {details.awards.map((award, idx) => (
                      <p key={idx}>• {award}</p>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
