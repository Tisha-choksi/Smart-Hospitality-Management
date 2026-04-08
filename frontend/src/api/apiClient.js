const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const AI_API_URL = process.env.REACT_APP_AI_URL || 'http://localhost:3000/api/ai';

export async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// New AI API function
export async function aiCall(endpoint, method = 'POST', params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${AI_API_URL}${endpoint}?${queryString}` : `${AI_API_URL}${endpoint}`;

  try {
    const response = await fetch(url, { method });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'AI Error');
    }

    return data;
  } catch (error) {
    console.error('AI Error:', error);
    throw error;
  }
}