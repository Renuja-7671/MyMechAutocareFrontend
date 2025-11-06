import apiClient from '../lib/api-client';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
}

export const authService = {
  login: async (data: LoginData) => {
    console.log('Logging in with data:', data);
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};