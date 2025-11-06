import apiClient from '../lib/api-client';

export interface TimeLogData {
  serviceId: string;
  hours: number;
  description: string;
  date: string;
}

export interface EmployeeData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  position?: string;
}

export const employeeService = {
  getAssignedServices: async () => {
    const response = await apiClient.get('/employees/assigned-services');
    return response.data.data; // Backend returns { success: true, data: [...] }
  },

  logTime: async (data: TimeLogData) => {
    const response = await apiClient.post('/employees/time-logs', data);
    return response.data.data; // Backend returns { success: true, data: {...} }
  },

  updateServiceStatus: async (serviceId: string, status: string, progress: number, notes?: string) => {
    const response = await apiClient.patch(`/employees/services/${serviceId}/status`, {
      status,
      progress,
      notes
    });
    return response.data.data; // Backend returns { success: true, data: {...} }
  },

  getTimeLogs: async (serviceId?: string) => {
    const response = await apiClient.get('/employees/time-logs', {
      params: serviceId ? { serviceId } : undefined
    });
    return response.data.data; // Backend returns { success: true, data: [...] }
  },

  getAvailableEmployees: async () => {
    const response = await apiClient.get('/employees/available');
    return response.data; // This endpoint might return data directly
  },

  createEmployee: async (data: EmployeeData) => {
    const response = await apiClient.post('/admin/employees', data);
    return response.data.data; // Backend returns { success: true, data: {...} }
  },
};