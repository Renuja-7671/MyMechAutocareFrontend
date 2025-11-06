import apiClient from '../lib/api-client';

export interface ModificationRequestData {
  vehicleId: string;
  modificationDetails: string;
  estimatedBudget: number;
}

export const projectService = {
  createModificationRequest: async (data: ModificationRequestData) => {
    const response = await apiClient.post('/projects/modification-requests', data);
    return response.data;
  },

  getMyModificationRequests: async () => {
    const response = await apiClient.get('/projects/my-modification-requests');
    return response.data;
  },

  deleteModificationRequest: async (requestId: string) => {
    const response = await apiClient.delete(`/projects/modification-requests/${requestId}`);
    return response.data;
  },

  getAllModificationRequests: async () => {
    const response = await apiClient.get('/projects/modification-requests');
    return response.data;
  },

  updateModificationStatus: async (projectId: string, status: string, approvedCost?: number) => {
    const response = await apiClient.patch(`/projects/modification-requests/${projectId}/status`, {
      status,
      approvedCost
    });
    return response.data;
  },
};