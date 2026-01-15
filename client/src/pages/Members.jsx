import { useState, useEffect, useCallback } from 'react';
import { Spin, message } from 'antd';
import { API_CONFIG } from '../config/api';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/members`);
      const data = await res.json();

      if (data.success) {
        setMembers(data.data);
      }
    } catch (err) {
      message.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  if (loading) {
    return (
      <section>
        <h1>Members</h1>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1>Members</h1>
      <ul>
        {members.map(m => (
          <li key={m._id}>
            <strong>{m.name}</strong> · {m.role} · {m.email || ''}
          </li>
        ))}
      </ul>
    </section>
  );
}
