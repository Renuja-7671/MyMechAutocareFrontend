import axiosClient from './axiosClient';

const adminApi = {
  // Get dashboard data
  getDashboardData: () => {
    return axiosClient.get('/admin/dashboard');
  },

  // Manage users (CRUD)
  getUsers: () => {
    return axiosClient.get('/admin/users');
  },
  
  createUser: (userData) => {
    return axiosClient.post('/admin/users', userData);
  },
  
  updateUser: (userId, userData) => {
    return axiosClient.put(`/admin/users/${userId}`, userData);
  },
  
  deleteUser: (userId) => {
    return axiosClient.delete(`/admin/users/${userId}`);
  },

  // Manage services (CRUD)
  getServices: () => {
    return axiosClient.get('/admin/services');
  },
  
  createService: (serviceData) => {
    return axiosClient.post('/admin/services', serviceData);
  },
  
  updateService: (serviceId, serviceData) => {
    return axiosClient.put(`/admin/services/${serviceId}`, serviceData);
  },
  
  deleteService: (serviceId) => {
    return axiosClient.delete(`/admin/services/${serviceId}`);
  },

  // Get performance reports
  getReports: () => {
    return axiosClient.get('/admin/reports');
  },

  // Get audit logs
  getAuditLogs: () => {
    return axiosClient.get('/admin/audit-logs');
  }
};

export default adminApi;