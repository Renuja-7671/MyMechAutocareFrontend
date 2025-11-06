import apiClient from '../lib/api-client';

export const adminService = {
  getAllUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data.data; // Backend returns { success: true, data: [...] }
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
    return response.data.data; // Backend returns { success: true, data: {...} }
  },

  deleteUser: async (userId: string) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data; // Backend returns { success: true, message: '...' }
  },

  getAllServices: async () => {
    const response = await apiClient.get('/admin/services');
    return response.data.data; // Backend returns { success: true, data: [...] }
  },

  assignServiceToEmployee: async (serviceId: string, employeeId: string) => {
    const response = await apiClient.post(`/admin/services/${serviceId}/assign`, { employeeId });
    return response.data.data; // Backend returns { success: true, data: {...} }
  },

  getReports: async (type: string, startDate?: string, endDate?: string) => {
    const response = await apiClient.get('/admin/reports', {
      params: { type, startDate, endDate }
    });
    return response.data.data; // Backend returns { success: true, data: {...} }
  },

  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard-stats');
    return response.data.data; // Backend returns { success: true, data: {...} }
  },

  getAllAppointments: async () => {
    const response = await apiClient.get('/admin/appointments');
    return response.data.data; // Backend returns { success: true, data: [...] }
  },
};