import { useState, useEffect, useCallback } from 'react';
import { Button, Flex, Collapse, Tag, Spin, message } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { API_CONFIG } from '../config/api';
import '../styles/SelectedPublications.css';

export default function SelectedPublications() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);

  const fetchPublications = useCallback(async () => {
    if (selectedYear === null) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('selected', 'true');

      if (selectedYear === '~2022') {
        params.append('yearLte', '2022');
      } else if (selectedYear) {
        params.append('year', selectedYear);
      }

      const res = await fetch(`${API_CONFIG.BASE_URL}/api/publications?${params}`);
      const data = await res.json();

      if (data.success) {
        setPublications(data.data);
      }
    } catch (err) {
      message.error('Failed to load publications');
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  const fetchYears = useCallback(async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/publications?selected=true`);
      const data = await res.json();

      if (data.success) {
        const uniqueYears = [...new Set(data.data.map(p => p.year))]
          .sort((a, b) => b - a)
          .filter(y => y > 2022);
        setYears(uniqueYears);
	if (uniqueYears.length > 0) {
	  setSelectedYear(prev => prev === null ? uniqueYears[0] : prev);
	}
      }
    } catch (err) {
      console.error('Failed to fetch years');
    }
  }, []);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  const getCategoryColor = (category) => {
    if (category.includes('SCI')) return 'blue';
    if (category.includes('SSCI')) return 'green';
    if (category.includes('KCI')) return 'orange';
    if (category.includes('Scopus')) return 'purple';
    if (category.includes('Patent')) return 'red';
    return 'default';
  };

  const createCollapseItems = () => {
    return publications.map((publication, index) => ({
      key: index.toString(),
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <span style={{
              color: 'black',
              fontSize: 15,
              fontFamily: 'Roboto',
              fontWeight: '500'
            }}>
              {publication.title}
            </span>
          </div>
          {publication.link && (
            <a href={publication.link} target="_blank" rel="noopener noreferrer">
              <LinkOutlined style={{ color: '#0E4A84', fontSize: '16px' }} />
            </a>
          )}
        </div>
      ),
      children: (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ margin: '5px 0' }}>
              <strong>with </strong> {publication.authors.join(', ')}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>in </strong> {publication.journal}, {publication.volume}
            </p>
            <div style={{ marginTop: '10px' }}>
              <Tag color={getCategoryColor(publication.category)} style={{ fontSize: '12px' }}>
                {publication.category}
              </Tag>
            </div>
          </div>
        </div>
      ),
    }));
  };

  const displayYears = years.length > 0 ? years : [2025, 2024, 2023];

  return (
    <div className="selected-publications-container">
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
          Selected Publications
        </h2>
      </div>

      <div className="year-filter-container">
        <Flex gap="small" wrap>
          {displayYears.map(year => (
            <Button
              key={year}
              type={selectedYear === year ? "primary" : "default"}
              onClick={() => handleYearClick(year)}
              style={{
                backgroundColor: selectedYear === year ? '#0E4A84' : 'white',
                color: selectedYear === year ? 'white' : '#0E4A84',
                borderColor: '#0E4A84',
                fontSize: 15,
                fontFamily: 'Roboto',
                fontWeight: '500',
                height: '40px',
                padding: '0 20px'
              }}
            >
              {year}
            </Button>
          ))}
          <Button
            type={selectedYear === '~2022' ? "primary" : "default"}
            onClick={() => handleYearClick('~2022')}
            style={{
              backgroundColor: selectedYear === '~2022' ? '#0E4A84' : 'white',
              color: selectedYear === '~2022' ? 'white' : '#0E4A84',
              borderColor: '#0E4A84',
              fontSize: 15,
              fontFamily: 'Roboto',
              fontWeight: '500',
              height: '40px',
              padding: '0 20px'
            }}
          >
            ~2022
          </Button>
        </Flex>
      </div>

      <div className="publications-list">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : publications.length > 0 ? (
          <Collapse
            items={createCollapseItems()}
            defaultActiveKey={['0']}
            style={{
              backgroundColor: 'white',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 50, color: '#888' }}>
            No publications found for this year.
          </div>
        )}
      </div>
    </div>
  );
}
