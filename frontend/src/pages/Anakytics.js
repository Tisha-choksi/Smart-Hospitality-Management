import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../api/apiClient';
import '../styles/analytics.css';

function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const result = await apiCall('/analytics/dashboard');
      setAnalytics(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading analytics...</p></div>;
  if (!analytics) return <div className="container"><p>No data available</p></div>;

  // Admin/Staff View
  if (user.role === 'ADMIN' || user.role === 'STAFF') {
    return (
      <main className="container">
        <h2>📊 Analytics Dashboard</h2>

        <div className="analytics-grid">
          <div className="metric-card">
            <h3>Total Requests</h3>
            <p className="metric-value">{analytics.totalRequests}</p>
            <p className="metric-subtitle">Completion Rate: {analytics.completionRate}%</p>
          </div>

          <div className="metric-card">
            <h3>Completed Requests</h3>
            <p className="metric-value">{analytics.completedRequests}</p>
            <p className="metric-subtitle">Pending: {analytics.totalRequests - analytics.completedRequests}</p>
          </div>

          <div className="metric-card">
            <h3>Total Bookings</h3>
            <p className="metric-value">{analytics.totalBookings}</p>
            <p className="metric-subtitle">Active</p>
          </div>

          <div className="metric-card revenue">
            <h3>Total Revenue</h3>
            <p className="metric-value">${analytics.totalRevenue.toFixed(2)}</p>
            <p className="metric-subtitle">YTD</p>
          </div>

          <div className="metric-card">
            <h3>Average Rating</h3>
            <p className="metric-value">{analytics.avgRating.toFixed(1)}</p>
            <p className="metric-subtitle">Out of 5</p>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card">
            <h3>Request Status Distribution</h3>
            <div className="status-breakdown">
              {analytics.requestStats.map((stat) => (
                <div key={stat.status} className="status-item">
                  <span>{stat.status}</span>
                  <span className="count">{stat._count.id}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>Feedback Sentiment</h3>
            <div className="sentiment-breakdown">
              {analytics.feedbackStats.map((stat) => (
                <div key={stat.sentiment} className={`sentiment-item ${stat.sentiment.toLowerCase()}`}>
                  <span>{stat.sentiment}</span>
                  <span className="count">{stat._count.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="recent-section">
          <h3>Recent Requests</h3>
          <div className="list">
            {analytics.recentRequests.map((req) => (
              <div key={req.id} className="list-item">
                <div>
                  <h4>{req.title}</h4>
                  <p>Guest: {req.guest.name} ({req.guest.email})</p>
                  <p>Type: {req.type} | Status: {req.status}</p>
                </div>
                <span className={`status-badge ${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error">{error}</div>}
      </main>
    );
  }

  // Guest View
  return (
    <main className="container">
      <h2>📊 My Activity</h2>

      <div className="analytics-grid">
        <div className="metric-card">
          <h3>My Requests</h3>
          <p className="metric-value">{analytics.totalRequests}</p>
        </div>

        <div className="metric-card">
          <h3>My Bookings</h3>
          <p className="metric-value">{analytics.totalBookings}</p>
        </div>

        <div className="metric-card">
          <h3>Feedback Submitted</h3>
          <p className="metric-value">{analytics.totalFeedback}</p>
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Requests</h3>
        <div className="list">
          {analytics.recentRequests.map((req) => (
            <div key={req.id} className="list-item">
              <div>
                <h4>{req.title}</h4>
                <p>{req.description}</p>
              </div>
              <span className={`status-badge ${req.status.toLowerCase()}`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="error">{error}</div>}
    </main>
  );
}

export default Analytics;