import React, { useState, useEffect } from 'react';
import { apiCall } from '../api/apiClient';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CLEANING'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const result = await apiCall('/requests');
      setRequests(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiCall('/requests', 'POST', formData);
      setFormData({ title: '', description: '', type: 'CLEANING' });
      await loadRequests();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h2>Service Requests</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Request Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option>CLEANING</option>
          <option>MAINTENANCE</option>
          <option>FRONT_DESK</option>
          <option>ROOM_SERVICE</option>
        </select>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="list">
        {requests.map(req => (
          <div key={req.id} className="list-item">
            <h3>{req.title}</h3>
            <p>{req.description}</p>
            <p>Status: <strong>{req.status}</strong></p>
            <p>Type: {req.type}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Requests;