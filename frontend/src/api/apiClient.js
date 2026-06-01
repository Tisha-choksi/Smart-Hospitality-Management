const PROD_API_URL = 'https://shmi-backend.onrender.com/api';
const PROD_AI_URL = 'https://shmi-aiservice.onrender.com';

const isBrowser = typeof window !== 'undefined';
const host = isBrowser ? window.location.hostname : '';
const isLocalHost = host === 'localhost' || host === '127.0.0.1';

const API_URL = isLocalHost
  ? (process.env.REACT_APP_API_URL || 'http://localhost:3000/api')
  : PROD_API_URL;

const AI_API_URL = isLocalHost
  ? (process.env.REACT_APP_AI_URL || 'http://localhost:8001')
  : PROD_AI_URL;

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
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { message: await response.text() };

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
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { detail: await response.text() };

    if (!response.ok) {
      throw new Error(data.detail || 'AI Error');
    }

    return data;
  } catch (error) {
    console.error('AI Error:', error);
    throw error;
  }
}