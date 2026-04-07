import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../api/apiClient';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        // You can add more API calls here
        setStats({ requests: 0, feedback: 0 });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <main className="container">
      <h2>Dashboard</h2>
      {user && (
        <div>
          <p>Welcome, <strong>{user.name}</strong>!</p>
          <p>Role: {user.role}</p>
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {stats && (
        <div className="stats">
          <div className="stat-card">
            <h3>Service Requests</h3>
            <p>{stats.requests}</p>
          </div>
          <div className="stat-card">
            <h3>Feedback</h3>
            <p>{stats.feedback}</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;