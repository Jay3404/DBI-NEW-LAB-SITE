import { useState, useEffect, useCallback } from 'react';
import { Spin } from 'antd';
import { API_CONFIG } from '../config/api';
import '../styles/Members.css';

export default function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlumni = useCallback(async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/members?isAlumni=true`);
      const data = await res.json();
      if (data.success) {
        setAlumni(data.data);
      }
    } catch {
      console.error('Failed to load alumni data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  // 카테고리 순서 및 레이블 정의
  const categoryOrder = ['Visiting', 'PhD', 'MS', 'BS'];
  const categoryLabels = {
    Visiting: 'Researcher / Postdoc',
    PhD: 'Ph.D.',
    MS: 'M.S.',
    BS: 'Research Intern'
  };

  // Alumni를 카테고리별, 연도별로 그룹핑
  const groupedAlumni = alumni.reduce((acc, member) => {
    const category = member.role;
    const year = member.graduationYear || 'Unknown';

    if (!acc[category]) {
      acc[category] = {};
    }
    if (!acc[category][year]) {
      acc[category][year] = [];
    }
    acc[category][year].push(member);
    return acc;
  }, {});

  // 각 연도 내에서 order 또는 이름순 정렬
  Object.keys(groupedAlumni).forEach(category => {
    Object.keys(groupedAlumni[category]).forEach(year => {
      groupedAlumni[category][year].sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.name.localeCompare(b.name);
      });
    });
  });

  if (loading) {
    return (
      <div className="member-container" style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  // INC Lab 스타일 수평 카드
  const renderAlumniCard = (member, index) => (
    <div key={member._id} className={`alumni-horizontal-card ${index % 2 === 0 ? 'even' : 'odd'}`}>
      <div className="alumni-horizontal-image">
        {member.image ? (
          <img src={`${API_CONFIG.BASE_URL}${member.image}`} alt={member.name} className="alumni-image-horizontal" />
        ) : (
          <img src="/src/assets/default_profile.png" alt={member.name} className="alumni-image-horizontal" />
        )}
      </div>
      <div className="alumni-horizontal-info">
        <h3 className="alumni-horizontal-name">
          {member.name} {member.nameKo && `(${member.nameKo})`}
        </h3>
        {member.affiliation && (
          <p className="alumni-detail">
            <strong>Affiliation:</strong> {member.affiliation}
          </p>
        )}
        {member.degree && (
          <p className="alumni-detail">
            <strong>Degree:</strong> {member.degree}
          </p>
        )}
        {member.currentPosition && (
          <p className="alumni-detail">
            <strong>Current Position:</strong> {member.currentPosition}
          </p>
        )}
        {member.interests && (
          <p className="alumni-detail">
            <strong>Interests:</strong> {member.interests}
          </p>
        )}
        {member.email && (
          <p className="alumni-detail">
            <strong>Contact:</strong> {member.email}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="member-container">
      {/* Header Section */}
      <div className="member-header">
        <h1 className="lab-members-title">Lab Members</h1>
        <h2 className="current-category">Alumni</h2>
      </div>

      {/* Main Content */}
      <div className="member-main-content">
        <div className="alumni-section">
          {categoryOrder.map(category => {
            const categoryData = groupedAlumni[category];
            if (!categoryData || Object.keys(categoryData).length === 0) return null;

            // 연도를 내림차순 정렬
            const years = Object.keys(categoryData)
              .filter(y => y !== 'Unknown')
              .sort((a, b) => Number(b) - Number(a));

            // Unknown 연도가 있으면 마지막에 추가
            if (categoryData['Unknown']) {
              years.push('Unknown');
            }

            return (
              <div key={category} className="alumni-category-section">
                <h3 className="category-title">{categoryLabels[category]}</h3>

                {years.map(year => (
                  <div key={year} className="alumni-year-group">
                    <h4 className="alumni-year-title">{year}</h4>
                    <div className="alumni-horizontal-list">
                      {categoryData[year].map((member, index) => renderAlumniCard(member, index))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {alumni.length === 0 && (
            <p style={{ textAlign: 'center', padding: 50 }}>No alumni data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
