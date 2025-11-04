import axiosClient from './axiosClient';

const chatbotApi = {
  // Send query to chatbot
  query: (queryData) => {
    return axiosClient.post('/chatbot/query', queryData);
  }
};

export default chatbotApi;