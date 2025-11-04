import axios from 'axios';

// Create axios instance with default config
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection and try again.'
      });
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.message);
      return Promise.reject({
        message: 'Server error. Please try again later.'
      });
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;