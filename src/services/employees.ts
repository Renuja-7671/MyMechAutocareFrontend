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
    return response.data;
  },

  logTime: async (data: TimeLogData) => {
    const response = await apiClient.post('/employees/time-logs', data);
    return response.data;
  },

  updateServiceStatus: async (serviceId: string, status: string, progress: number, notes?: string) => {
    const response = await apiClient.patch(`/employees/services/${serviceId}/status`, {
      status,
      progress,
      notes
    });
    return response.data;
  },

  getTimeLogs: async (serviceId?: string) => {
    const response = await apiClient.get('/employees/time-logs', {
      params: serviceId ? { serviceId } : undefined
    });
    return response.data;
  },

  getAvailableEmployees: async () => {
    const response = await apiClient.get('/employees/available');
    return response.data;
  },

  createEmployee: async (data: EmployeeData) => {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },
};