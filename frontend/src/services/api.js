import axios from 'axios';

// Priority for determining API base URL (runtime override > env > default)
const RUNTIME_API = typeof window !== 'undefined' && window.__APP_API_URL ? window.__APP_API_URL : null;
const API_BASE = RUNTIME_API || process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE + '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
