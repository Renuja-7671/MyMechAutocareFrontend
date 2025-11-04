import axiosClient from './axiosClient';

const customerApi = {
  // Get customer appointments
  getAppointments: () => {
    return axiosClient.get('/customer/appointments');
  },

  // Book a new appointment
  bookAppointment: (appointmentData) => {
    return axiosClient.post('/appointments/book', appointmentData);
  },

  // Upload modification request
  uploadModification: (modificationData) => {
    return axiosClient.post('/customer/modification', modificationData);
  },

  // Track service progress
  trackProgress: (appointmentId) => {
    return axiosClient.get(`/appointments/${appointmentId}/status`);
  },

  // Get notifications
  getNotifications: () => {
    return axiosClient.get('/notifications');
  }
};

export default customerApi;