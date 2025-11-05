import apiClient from '../lib/api-client';

export interface AppointmentData {
  vehicleId: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
}

export const appointmentService = {
  fetchAppointments: async () => {
    const response = await apiClient.get('/appointments');
    return response.data;
  },

  createAppointment: async (data: AppointmentData) => {
    const response = await apiClient.post('/appointments', data);
    return response.data;
  },

  updateAppointment: async (id: string, data: Partial<AppointmentData>) => {
    const response = await apiClient.patch(`/appointments/${id}`, data);
    return response.data;
  },

  getServiceProgress: async () => {
    const response = await apiClient.get('/appointments/service-progress');
    return response.data;
  },

  getAllAppointments: async () => {
    const response = await apiClient.get('/appointments/all');
    return response.data;
  },

  getUpcomingAppointments: async () => {
    const response = await apiClient.get('/appointments/upcoming');
    return response.data;
  },
};