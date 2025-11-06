import apiClient from '../lib/api-client';

export interface VehicleData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  exteriorImages?: File[];
  interiorImage?: File;
}

export const vehicleService = {
  fetchVehicles: async (customerId?: number) => {
    const response = await apiClient.get('/vehicles', {
      params: customerId ? { customer_id: customerId } : undefined
    });
    return response.data.data; // Return just the data array
  },

  createVehicle: async (data: VehicleData) => {
    const formData = new FormData();
    formData.append('make', data.make);
    formData.append('model', data.model);
    formData.append('year', data.year.toString());
    formData.append('licensePlate', data.licensePlate);
    if (data.vin) formData.append('vin', data.vin);

    if (data.exteriorImages) {
      data.exteriorImages.forEach((file, index) => {
        formData.append(`exteriorImage${index + 1}`, file);
      });
    }

    if (data.interiorImage) {
      formData.append('interiorImage', data.interiorImage);
    }

    const response = await apiClient.post('/vehicles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data; // Return just the data
  },

  getVehicleServiceHistory: async (vehicleId: string) => {
    const response = await apiClient.get(`/vehicles/${vehicleId}/service-history`);
    return response.data.data; // Return just the data
  },

  getVehicleImages: async (vehicleId: number) => {
    const response = await apiClient.get(`/vehicles/${vehicleId}/images`);
    return response.data.data; // Return just the data
  },
};