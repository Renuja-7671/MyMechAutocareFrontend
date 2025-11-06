import apiClient from '../lib/api-client';
import { ApiResponse } from '../lib/api';

export interface ChatbotMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  data?: {
    intent?: string;
    availableSlots?: string[];
    date?: string;
  };
  isError?: boolean;
}

export interface ChatbotResponse {
  reply: string;
  availableSlots?: string[];
  date?: string;
  intent?: string;
}

export const chatbotService = {
  /**
   * Send a message to the chatbot and get a response
   */
  async sendMessage(message: string): Promise<ApiResponse<ChatbotResponse>> {
    try {
      console.log('Sending chatbot message:', message);

      const response = await apiClient.post('/chatbot/message', {
        message: message.trim(),
      });

      console.log('Chatbot response:', response.data);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Chatbot service error:', error);

      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to send message. Please try again.',
      };
    }
  },

  /**
   * Check available slots for a specific date and service type
   */
  async checkSlots(date: string, serviceType: string): Promise<any> {
    const response = await apiClient.get('/chatbot/check-slots', {
      params: { date, serviceType }
    });
    return response.data;
  },
};