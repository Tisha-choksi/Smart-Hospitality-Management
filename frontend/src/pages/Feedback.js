import React, { useState } from 'react';
import { apiCall, aiCall } from '../api/apiClient';

function Feedback() {
  const [formData, setFormData] = useState({
    rating: '5',
    comment: '',
    category: 'OVERALL'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sentiment, setSentiment] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const analyzeSentiment = async () => {
    if (!formData.comment) return;

    try {
      const result = await aiCall('/ai/sentiment/analyze', 'POST', {
        text: formData.comment
      });
      setSentiment(result);
    } catch (err) {
      console.error('Sentiment analysis error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Analyze sentiment first
      if (formData.comment) {
        await analyzeSentiment();
      }

      // Submit feedback
      await apiCall('/feedback', 'POST', {
        ...formData,
        rating: parseInt(formData.rating)
      });

      setSuccess('Feedback submitted successfully!');
      setFormData({ rating: '5', comment: '', category: 'OVERALL' });
      setSentiment(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h2>Submit Feedback</h2>

      <form onSubmit={handleSubmit}>
        <label>Rating (1-5):</label>
        <select name="rating" value={formData.rating} onChange={handleChange}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>

        <textarea
          name="comment"
          placeholder="Your feedback..."
          value={formData.comment}
          onChange={handleChange}
          onBlur={analyzeSentiment}
        ></textarea>

        {sentiment && (
          <div className="sentiment-analysis">
            <p><strong>Sentiment:</strong> <span className={sentiment.sentiment.toLowerCase()}>{sentiment.sentiment}</span></p>
            <p><strong>Confidence:</strong> {(sentiment.confidence * 100).toFixed(0)}%</p>
          </div>
        )}

        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option>ROOM_QUALITY</option>
          <option>STAFF_SERVICE</option>
          <option>CLEANLINESS</option>
          <option>AMENITIES</option>
          <option>OVERALL</option>
        </select>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </main>
  );
}

export default Feedback;