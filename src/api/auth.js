import axiosClient from './axiosClient';

const authApi = {
  // Register a new user
  register: (userData) => {
    return axiosClient.post('/auth/register', userData);
  },

  // Login user
  login: (credentials) => {
    return axiosClient.post('/auth/login', credentials);
  },

  // Get current user profile
  getProfile: () => {
    return axiosClient.get('/user/me');
  },

  // Logout user
  logout: () => {
    return new Promise((resolve) => {
      localStorage.removeItem('token');
      resolve();
    });
  }
};

export default authApi;