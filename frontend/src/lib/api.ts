import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      const token = parsed?.state?.token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.error('Error reading token from localStorage', err);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return structured error if available
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
