import apiClient from '../lib/api-client';

export const chatbotService = {
  checkSlots: async (date: string, serviceType: string) => {
    const response = await apiClient.get('/chatbot/check-slots', {
      params: { date, serviceType }
    });
    return response.data;
  },
};