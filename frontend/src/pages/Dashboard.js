import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../api/apiClient';
import AIChat from '../components/AIChat';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const requests = await apiCall('/requests');
        const feedback = await apiCall('/feedback');

        setStats({
          requests: requests.data?.length || 0,
          feedback: feedback.data?.length || 0
        });
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
        <div className="welcome-section">
          <p>Welcome, <strong>{user.name}</strong>!</p>
          <p>Role: {user.role}</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <div className="dashboard-grid">
        <div className="card">
          <h3>📋 Service Requests</h3>
          <p className="stat-number">{stats?.requests || 0}</p>
          <a href="/requests" className="btn btn-primary">View All</a>
        </div>

        <div className="card">
          <h3>⭐ Feedback</h3>
          <p className="stat-number">{stats?.feedback || 0}</p>
          <a href="/feedback" className="btn btn-primary">View All</a>
        </div>

        <div className="card">
          <h3>🤖 AI Assistant</h3>
          <p>Chat with our concierge</p>
          <button
            onClick={() => setShowChat(!showChat)}
            className="btn btn-primary"
          >
            {showChat ? 'Hide' : 'Open'} Chat
          </button>
        </div>
      </div>

      {showChat && <AIChat />}
    </main>
  );
}

export default Dashboard;