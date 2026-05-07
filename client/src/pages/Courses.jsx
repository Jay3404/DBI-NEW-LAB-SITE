import React, { useState, useEffect, useMemo } from 'react';
import '../styles/Courses.css';
import { API_CONFIG } from '../config/api';

// 기존 이미지들 (fallback용)
import OT_25 from '../assets/course_imgs/OT_25.png';
import DS_25 from '../assets/course_imgs/DS_25.png';
import ISD_fa25 from '../assets/course_imgs/ISD_fa25.png';
import CD2_25 from '../assets/course_imgs/CD2_25.png';
import ERP_25 from '../assets/course_imgs/ERP_25.png';
import BIAI_25 from '../assets/course_imgs/BIAI_25.png';
import CD1_25 from '../assets/course_imgs/CD1_25.png';
import ISD_sp25 from '../assets/course_imgs/ISD_sp25.png';
import ISA_25 from '../assets/course_imgs/ISA_24.png';

// Fallback 데이터
const FALLBACK_COURSES = {
  Hanyang: [
    // Undergraduate - Spring
    { id: 1, name: 'Organization Theory', term: 'Spring', grad: 'Undergraduate', year: '2024, 2025', image: OT_25 },
    { id: 2, name: 'ERP Systems', term: 'Spring', grad: 'Undergraduate', year: '2025', image: ERP_25 },
    { id: 3, name: 'Career Development I', term: 'Spring', grad: 'Undergraduate', year: '2025', image: CD1_25 },
    { id: 4, name: 'Business Intelligence & AI Implementation', term: 'Spring', grad: 'Undergraduate', year: '2025', image: BIAI_25 },
    // Undergraduate - Fall
    { id: 5, name: 'Decision Support with Data Science', term: 'Fall', grad: 'Undergraduate', year: '2025', image: DS_25 },
    { id: 6, name: 'Information Systems Design', term: 'Fall', grad: 'Undergraduate', year: '2025', image: ISD_fa25 },
    { id: 7, name: 'Career Development II', term: 'Fall', grad: 'Undergraduate', year: '2025', image: CD2_25 },
    // Graduate - Spring
    { id: 8, name: 'Information Systems Design', term: 'Spring', grad: 'Graduate', year: '2025', image: ISD_sp25 },
    // Graduate - Fall
    { id: 9, name: 'Information Systems Analysis', term: 'Fall', grad: 'Graduate', year: '2025', image: ISA_25 },
  ]
};

export default function Courses() {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setCourses(FALLBACK_COURSES);
      }
    } catch {
      console.log('Using fallback course data');
      setCourses(FALLBACK_COURSES);
    } finally {
      setLoading(false);
    }
  };

  // 대학별로 데이터를 grad와 term으로 그룹화
  const groupedData = useMemo(() => {
    if (!courses) return {};

    const result = {};

    Object.entries(courses).forEach(([university, courseList]) => {
      result[university] = {
        Undergraduate: {
          Spring: [],
          Fall: []
        },
        Graduate: {
          Spring: [],
          Fall: []
        }
      };

      courseList.forEach(course => {
        const grad = course.grad;
        const term = course.term;
        if (result[university][grad] && result[university][grad][term]) {
          result[university][grad][term].push(course);
        }
      });
    });

    return result;
  }, [courses]);

  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http') || image.startsWith('data:')) return image;
    if (image.startsWith('/')) return `${API_CONFIG.BASE_URL}${image}`;
    return image;
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

  // 특정 grad 레벨에 코스가 있는지 확인
  const hasCoursesInGrad = (universityData, grad) => {
    if (!universityData || !universityData[grad]) return false;
    return universityData[grad].Spring.length > 0 || universityData[grad].Fall.length > 0;
  };

  return (
    <div className="courses-container">
      {/* Header */}
      <div className="courses-header">
        <h1 className="courses-title">Courses</h1>
      </div>

      {/* Course Tables by University */}
      {Object.entries(groupedData).map(([university, data]) => (
        <div key={university} className="university-table-section">
          {/* University Header */}
          <div className="university-table-header">
            <span>{university === 'Hanyang' ? 'Hanyang University' : 'Seoul National University'}</span>
          </div>

          {/* Table Structure */}
          <div className="courses-table">
            {/* Term Headers */}
            <div className="table-row table-header-row">
              <div className="table-cell grad-label-cell"></div>
              <div className="table-cell term-header spring">Spring</div>
              <div className="table-cell term-header fall">Fall</div>
            </div>

            {/* Undergraduate Row */}
            {hasCoursesInGrad(data, 'Undergraduate') && (
              <div className="table-row">
                <div className="table-cell grad-label-cell">
                  <div className="grad-label">Under<br/>Graduate</div>
                </div>
                <div className="table-cell courses-cell">
                  <div className="courses-cell-content">
                    {data.Undergraduate.Spring.map((course) => (
                      <CourseCard
                        key={course._id || course.id}
                        course={course}
                        getImageUrl={getImageUrl}
                      />
                    ))}
                  </div>
                </div>
                <div className="table-cell courses-cell">
                  <div className="courses-cell-content">
                    {data.Undergraduate.Fall.map((course) => (
                      <CourseCard
                        key={course._id || course.id}
                        course={course}
                        getImageUrl={getImageUrl}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Graduate Row */}
            {hasCoursesInGrad(data, 'Graduate') && (
              <div className="table-row">
                <div className="table-cell grad-label-cell">
                  <div className="grad-label">Graduate</div>
                </div>
                <div className="table-cell courses-cell">
                  <div className="courses-cell-content">
                    {data.Graduate.Spring.map((course) => (
                      <CourseCard
                        key={course._id || course.id}
                        course={course}
                        getImageUrl={getImageUrl}
                      />
                    ))}
                  </div>
                </div>
                <div className="table-cell courses-cell">
                  <div className="courses-cell-content">
                    {data.Graduate.Fall.map((course) => (
                      <CourseCard
                        key={course._id || course.id}
                        course={course}
                        getImageUrl={getImageUrl}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {Object.keys(groupedData).length === 0 && (
        <div className="courses-empty">
          <p>No courses available.</p>
        </div>
      )}
    </div>
  );
}

// Course Card Component
function CourseCard({ course, getImageUrl }) {
  const handleClick = () => {
    if (course.link) {
      window.open(course.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`course-card ${course.link ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      <div
        className="course-card-image"
        style={{ backgroundImage: `url(${getImageUrl(course.image)})` }}
      >
        <div className="course-card-overlay">
          <h3 className="course-card-title">{course.name}</h3>
          <p className="course-card-year">{course.year}</p>
        </div>
      </div>
    </div>
  );
}
