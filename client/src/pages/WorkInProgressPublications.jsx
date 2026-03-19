import { useState, useEffect, useCallback } from 'react';
import { Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { API_CONFIG } from '../config/api';
import '../styles/WorkInProgressPublications.css';

export default function WorkInProgressPublications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/publications?wip=true`);
      const data = await res.json();

      if (data.success) {
        setPublications(data.data);
      }
    } catch (err) {
      message.error('Failed to load publications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  if (loading) {
    return (
      <div className="work-in-progress-container">
        <div className="publications-header">
          <h1 style={{
            color: '#0E4A84',
            fontSize: 28,
            fontFamily: 'Roboto',
            fontWeight: '700',
            margin: 0,
            marginBottom: '10px'
          }}>
            Publications
          </h1>
          <h2 style={{
            color: 'black',
            fontSize: 20,
            fontFamily: 'Roboto',
            fontWeight: '500',
            margin: 0,
            marginBottom: '30px'
          }}>
            Work-in-Progress
          </h2>
        </div>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="work-in-progress-container">
      <div className="publications-header">
        <h1 style={{
          color: '#0E4A84',
          fontSize: 28,
          fontFamily: 'Roboto',
          fontWeight: '700',
          margin: 0,
          marginBottom: '10px'
        }}>
          Publications
        </h1>
        <h2 style={{
          color: 'black',
          fontSize: 20,
          fontFamily: 'Roboto',
          fontWeight: '500',
          margin: 0,
          marginBottom: '30px'
        }}>
          Work-in-Progress
        </h2>
      </div>

      <div className="publications-list">
        {publications.length > 0 ? (
          publications.map((publication, index) => (
            <div key={publication._id || index} className="publication-item">
              <div className="publication-content">
                <EditOutlined className="edit-icon" />
                <span className="publication-title">{publication.title}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: 50, color: '#888' }}>
            No work-in-progress publications.
          </div>
        )}
      </div>
    </div>
  );
}
