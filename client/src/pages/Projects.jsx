import { useState, useEffect, useCallback } from 'react';
import { Spin, message } from 'antd';
import { API_CONFIG } from '../config/api';
import '../styles/Projects.css';

export default function Projects() {
  const [activeTab, setActiveTab] = useState('current');
  const [projects, setProjects] = useState({ current: [], workInProgress: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/projects`);
      const data = await res.json();

      if (data.success) {
        const grouped = {
          current: data.data.filter(p => p.status === 'Ongoing'),
          workInProgress: data.data.filter(p => p.status === 'Work In Progress'),
          past: data.data.filter(p => p.status === 'Completed')
        };
        setProjects(grouped);
      }
    } catch (err) {
      message.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const renderProjectsTable = (projectList) => {
    if (projectList.length === 0) {
      return (
        <div className="no-projects">
          <p>No projects available for this category.</p>
        </div>
      );
    }

    if (screenWidth <= 480) {
      return (
        <div className="projects-table projects-table-mobile">
          <div className="table-header">
            <div className="header-cell project-header">Project</div>
          </div>
          <div className="table-body">
            {projectList.map((project, index) => (
              <div key={project._id || index} className="table-row">
                <div className="table-cell project-cell">{project.title}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (screenWidth <= 768) {
      return (
        <div className="projects-table projects-table-tablet">
          <div className="table-header">
            <div className="header-cell project-header">Project</div>
            <div className="header-cell support-header">Support</div>
          </div>
          <div className="table-body">
            {projectList.map((project, index) => (
              <div key={project._id || index} className="table-row">
                <div className="table-cell project-cell">{project.title}</div>
                <div className="table-cell support-cell">{project.sponsor || '-'}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="projects-table projects-table-desktop">
        <div className="table-header">
          <div className="header-cell project-header">Project</div>
          <div className="header-cell support-header">Support</div>
          <div className="header-cell date-header">Date</div>
        </div>
        <div className="table-body">
          {projectList.map((project, index) => (
            <div key={project._id || index} className="table-row">
              <div className="table-cell project-cell">{project.title}</div>
              <div className="table-cell support-cell">{project.sponsor || '-'}</div>
              <div className="table-cell date-cell">{project.period || '-'}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="projects-container">
        <div className="projects-header">
          <h1 className="projects-title">Projects</h1>
        </div>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1 className="projects-title">Projects</h1>
      </div>

      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Current
        </button>
        <button
          className={`tab-button ${activeTab === 'workInProgress' ? 'active' : ''}`}
          onClick={() => setActiveTab('workInProgress')}
        >
          Work-In-Progress
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past (Selected)
        </button>
      </div>

      <div className="projects-content">
        {renderProjectsTable(projects[activeTab])}
      </div>
    </div>
  );
}
