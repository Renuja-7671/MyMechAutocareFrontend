import apiClient from '../lib/api-client';

export interface ModificationRequestData {
  vehicleId: string;
  modificationDetails: string;
  estimatedBudget: number;
}

export const projectService = {
  createModificationRequest: async (data: ModificationRequestData) => {
    const response = await apiClient.post('/projects', data);
    return response.data.data; // Return just the data
  },

  getMyModificationRequests: async () => {
    const response = await apiClient.get('/projects');
    return response.data.data; // Return just the data array
  },

  deleteModificationRequest: async (requestId: string) => {
    const response = await apiClient.delete(`/projects/${requestId}`);
    return response.data; // Just success message
  },

  getAllModificationRequests: async () => {
    const response = await apiClient.get('/admin/modifications');
    return response.data.data; // Return just the data array
  },

  updateModificationStatus: async (projectId: string, status: string, approvedCost?: number) => {
    const response = await apiClient.patch(`/admin/modifications/${projectId}`, {
      status,
      approvedCost
    });
    return response.data.data; // Return just the data
  },
};