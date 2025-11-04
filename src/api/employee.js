import axiosClient from './axiosClient';

const employeeApi = {
  // Get assigned services
  getAssignedServices: () => {
    return axiosClient.get('/employee/services');
  },

  // Log work hours
  logWorkHours: (logData) => {
    return axiosClient.post('/employee/logs', logData);
  },

  // Update service progress
  updateService: (serviceId, updateData) => {
    return axiosClient.patch(`/employee/update/${serviceId}`, updateData);
  },

  // Upload documentation photos
  uploadDocumentation: (photoData) => {
    return axiosClient.post('/employee/documentation', photoData);
  }
};

export default employeeApi;