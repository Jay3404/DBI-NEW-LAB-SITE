import React, { useState, useEffect, useMemo } from 'react';
import '../styles/Courses.css';
import { API_CONFIG } from '../config/api';

// Fallback 이미지 (API 실패 시 사용)
import hanyangIcon from '../assets/hanyang_icon.png';
import snuIcon from '../assets/snu_icon.png';

// 기존 이미지들 (fallback용)
import OT_25 from '../assets/course_imgs/OT_25.png';
import DS_25 from '../assets/course_imgs/DS_25.png';
import ISD_fa25 from '../assets/course_imgs/ISD_fa25.png';
import CD2_25 from '../assets/course_imgs/CD2_25.png';
import ERP_25 from '../assets/course_imgs/ERP_25.png';
import BIAI_25 from '../assets/course_imgs/BIAI_25.png';
import CD1_25 from '../assets/course_imgs/CD1_25.png';
import ISD_sp25 from '../assets/course_imgs/ISD_sp25.png';
import OT_24 from '../assets/course_imgs/OT_24.png';
import ISA_24 from '../assets/course_imgs/ISA_24.png';
import IS_24 from '../assets/course_imgs/IS_24.png';
import IS_23 from '../assets/course_imgs/IS_23.png';

// Fallback 데이터
const FALLBACK_COURSES = {
  Hanyang: [
    { id: 1, name: 'Object Oriented Thinking', term: 'Spring', grad: 'Undergraduate', year: '2025', image: OT_25 },
    { id: 2, name: 'Database Systems', term: 'Spring', grad: 'Undergraduate', year: '2025', image: DS_25 },
    { id: 3, name: 'Information System Design', term: 'Fall', grad: 'Graduate', year: '2025', image: ISD_fa25 },
    { id: 4, name: 'Capstone Design 2', term: 'Fall', grad: 'Undergraduate', year: '2025', image: CD2_25 },
    { id: 5, name: 'ERP', term: 'Spring', grad: 'Graduate', year: '2025', image: ERP_25 },
    { id: 6, name: 'Business Intelligence & AI', term: 'Spring', grad: 'Graduate', year: '2025', image: BIAI_25 },
    { id: 7, name: 'Capstone Design 1', term: 'Spring', grad: 'Undergraduate', year: '2025', image: CD1_25 },
    { id: 8, name: 'Information System Design', term: 'Spring', grad: 'Graduate', year: '2025', image: ISD_sp25 },
    { id: 9, name: 'Object Oriented Thinking', term: 'Fall', grad: 'Undergraduate', year: '2024', image: OT_24 },
    { id: 10, name: 'Information System Architecture', term: 'Fall', grad: 'Graduate', year: '2024', image: ISA_24 },
  ],
  SNU: [
    { id: 11, name: 'Information Systems', term: 'Fall', grad: 'Graduate', year: '2024', image: IS_24 },
    { id: 12, name: 'Information Systems', term: 'Fall', grad: 'Graduate', year: '2023', image: IS_23 },
  ]
};

export default function Courses() {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    university: 'All',
    term: 'All',
    grad: 'All'
  });

  // API에서 데이터 로드
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.COURSES.GROUPED}`);
      const data = await res.json();

      if (data.success && Object.keys(data.data).length > 0) {
        setCourses(data.data);
      } else {
        // API 데이터가 없으면 fallback 사용
        setCourses(FALLBACK_COURSES);
      }
    } catch (err) {
      console.log('Using fallback course data');
      setCourses(FALLBACK_COURSES);
    } finally {
      setLoading(false);
    }
  };

  // 필터 적용
  const filteredCourses = useMemo(() => {
    if (!courses) return {};

    const result = {};

    Object.entries(courses).forEach(([university, courseList]) => {
      // University 필터
      if (filters.university !== 'All' && university !== filters.university) {
        return;
      }

      const filtered = courseList.filter(course => {
        if (filters.term !== 'All' && course.term !== filters.term) return false;
        if (filters.grad !== 'All' && course.grad !== filters.grad) return false;
        return true;
      });

      if (filtered.length > 0) {
        result[university] = filtered;
      }
    });

    return result;
  }, [courses, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http') || image.startsWith('data:')) return image;
    if (image.startsWith('/')) return `${API_CONFIG.BASE_URL}${image}`;
    return image; // 이미 import된 이미지
  };

  if (loading) {
    return (
      <div className="courses-container">
        <div className="courses-header">
          <h1 className="courses-title">Courses</h1>
        </div>
        <div className="courses-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      {/* Header */}
      <div className="courses-header">
        <h1 className="courses-title">Courses</h1>
      </div>

      {/* Filters */}
      <div className="courses-filters">
        <div className="filter-group">
          <span className="filter-label">University</span>
          <div className="filter-buttons">
            {['All', 'Hanyang', 'SNU'].map(option => (
              <button
                key={option}
                className={`filter-btn ${filters.university === option ? 'active' : ''}`}
                onClick={() => handleFilterChange('university', option)}
              >
                {option === 'Hanyang' && <img src={hanyangIcon} alt="" className="filter-icon" />}
                {option === 'SNU' && <img src={snuIcon} alt="" className="filter-icon" />}
                <span>{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Term</span>
          <div className="filter-buttons">
            {['All', 'Spring', 'Fall'].map(option => (
              <button
                key={option}
                className={`filter-btn ${filters.term === option ? 'active' : ''}`}
                onClick={() => handleFilterChange('term', option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Level</span>
          <div className="filter-buttons">
            {['All', 'Undergraduate', 'Graduate'].map(option => (
              <button
                key={option}
                className={`filter-btn ${filters.grad === option ? 'active' : ''}`}
                onClick={() => handleFilterChange('grad', option)}
              >
                {option === 'Undergraduate' ? 'UG' : option === 'Graduate' ? 'Grad' : option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Sections by University */}
      {Object.keys(filteredCourses).length === 0 ? (
        <div className="courses-empty">
          <p>No courses found matching your filters.</p>
        </div>
      ) : (
        Object.entries(filteredCourses).map(([university, courseList]) => (
          <section key={university} className="university-section">
            <div className="university-header">
              <img
                src={university === 'Hanyang' ? hanyangIcon : snuIcon}
                alt={university}
                className="university-icon"
              />
              <h2 className="university-name">
                {university === 'Hanyang' ? 'Hanyang University' : 'Seoul National University'}
              </h2>
            </div>

            <div className="courses-grid">
              {courseList.map((course) => (
                <div key={course._id || course.id} className="course-card">
                  <div
                    className="course-card-image"
                    style={{ backgroundImage: `url(${getImageUrl(course.image)})` }}
                  >
                    <div className="course-card-overlay">
                      <h3 className="course-card-title">{course.name}</h3>
                      <div className="course-card-tags">
                        <span className={`course-tag term-${course.term.toLowerCase()}`}>
                          {course.term}
                        </span>
                        <span className={`course-tag grad-${course.grad.toLowerCase()}`}>
                          {course.grad === 'Undergraduate' ? 'UG' : 'Grad'}
                        </span>
                      </div>
                      <p className="course-card-year">{course.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
