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
    return response.data.data; // Return just the data array
  },

  createAppointment: async (data: AppointmentData) => {
    const response = await apiClient.post('/appointments', data);
    return response.data.data; // Return just the data
  },

  updateAppointment: async (id: string, data: Partial<AppointmentData>) => {
    const response = await apiClient.patch(`/appointments/${id}`, data);
    return response.data.data; // Return just the data
  },

  getServiceProgress: async () => {
    const response = await apiClient.get('/appointments/service-progress');
    return response.data.data; // Return just the data array
  },

  getAllAppointments: async () => {
    const response = await apiClient.get('/appointments/all');
    return response.data.data; // Return just the data
  },

  getUpcomingAppointments: async () => {
    const response = await apiClient.get('/appointments/upcoming');
    return response.data.data; // Return just the data
  },

  getAvailableTimeSlots: async (date: string) => {
    const response = await apiClient.get('/appointments/available-slots', {
      params: { date },
    });
    return response.data.data; // Return just the data
  },
};