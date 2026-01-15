import { useState, useEffect, useRef, useCallback } from 'react';
import { Spin, message } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { API_CONFIG } from '../config/api';
import '../styles/News.css';

export default function News() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const [timelineHeight, setTimelineHeight] = useState({ top: 8, bottom: 8 });
  const timelineRef = useRef(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/news`);
      const data = await res.json();

      if (data.success) {
        setNewsData(data.data);
      }
    } catch (err) {
      message.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const safeLink = (url) => /^https?:\/\//i.test(url) ? url : `https://${url}`;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const calculateTimelineHeight = useCallback(() => {
    if (timelineRef.current && window.innerWidth <= 1100) {
      const timeline = timelineRef.current;
      const newsItems = timeline.querySelectorAll('.news-item');

      if (newsItems.length > 0) {
        const firstItem = newsItems[0];
        const lastItem = newsItems[newsItems.length - 1];

        const firstItemRect = firstItem.getBoundingClientRect();
        const lastItemRect = lastItem.getBoundingClientRect();
        const timelineRect = timeline.getBoundingClientRect();

        const firstDotCenter = firstItemRect.top - timelineRect.top + 8;
        const lastDotCenter = lastItemRect.top - timelineRect.top + 8;

        setTimelineHeight({
          top: firstDotCenter,
          bottom: timelineRect.height - lastDotCenter
        });
      }
    }
  }, []);

  useEffect(() => {
    if (newsData.length === 0) return;

    const handleScroll = () => {
      if (timelineRef.current) {
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;

        if (window.innerWidth <= 1100) {
          const newsItems = timelineRef.current.querySelectorAll('.news-item');
          let closestIndex = 0;
          let minDistance = Infinity;

          const isAtTop = scrollTop <= 5;
          const isAtBottom = windowHeight + scrollTop >= documentHeight - 5;

          if (isAtTop) {
            closestIndex = 0;
          } else if (isAtBottom) {
            closestIndex = newsData.length - 1;
          } else {
            newsItems.forEach((item, index) => {
              const itemRect = item.getBoundingClientRect();
              const itemTop = itemRect.top;
              const itemBottom = itemRect.bottom;

              const isVisible = itemTop < windowHeight && itemBottom > 0;

              if (isVisible) {
                const itemCenter = itemTop + itemRect.height / 2;
                const windowCenter = windowHeight / 2;
                const distance = Math.abs(itemCenter - windowCenter);

                if (distance < minDistance) {
                  minDistance = distance;
                  closestIndex = index;
                }
              }
            });
          }

          setActiveNewsIndex(closestIndex);
        } else {
          const isAtTop = scrollTop <= 5;
          const isAtBottom = windowHeight + scrollTop >= documentHeight - 5;

          if (isAtTop) {
            setActiveNewsIndex(0);
          } else if (isAtBottom) {
            setActiveNewsIndex(newsData.length - 1);
          } else {
            const newsItems = timelineRef.current.querySelectorAll('.news-item');
            let closestIndex = 0;
            let minDistance = Infinity;

            newsItems.forEach((item, index) => {
              const itemRect = item.getBoundingClientRect();
              const itemCenter = itemRect.top + itemRect.height / 2;
              const windowCenter = windowHeight / 2;
              const distance = Math.abs(itemCenter - windowCenter);

              if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
              }
            });

            setActiveNewsIndex(closestIndex);
          }
        }
      }
    };

    calculateTimelineHeight();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateTimelineHeight);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateTimelineHeight);
    };
  }, [newsData.length, calculateTimelineHeight]);

  if (loading) {
    return (
      <div className="news-container">
        <div className="news-header">
          <h1 className="news-title">News</h1>
        </div>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="news-container">
      <div className="news-header">
        <h1 className="news-title">News</h1>
      </div>

      <div className="timeline-container" ref={timelineRef}>
        <div className="timeline-line"></div>

        {window.innerWidth <= 1100 && (
          <div
            className="timeline-line-mobile"
            style={{
              top: `${timelineHeight.top}px`,
              bottom: `${timelineHeight.bottom}px`
            }}
          ></div>
        )}

        {newsData.map((news, index) => (
          <div
            key={news._id || index}
            className={`news-item ${index === activeNewsIndex ? 'active' : ''}`}
          >
            <div className="timeline-dot"></div>
            <div className="news-content">
              <div className="news-card-header">
                <div className="news-date">{formatDate(news.date)}</div>
                {news?.link?.trim() ? (
                  <a
                    href={safeLink(news.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="원문 링크 열기"
                    className="news-link"
                  >
                    <LinkOutlined style={{ color: '#0E4A84', fontSize: 16 }} />
                  </a>
                ) : null}
              </div>
              <div className="news-title-text">{news.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
