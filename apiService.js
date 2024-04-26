const axios = require('axios');

const baseURL = 'http://localhost:5000';

const api = axios.create({
  baseURL,
//   timeout: 5000, // Set a timeout for requests (optional)
});

const apiService = {
  async screenshot() {
    try {
      const response = await api.get(`/screenshot`);
      return response
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error
    }
  },

  async conversation(chat) {
    try {
      const response = await api.get(`/conversation?question=${chat}`);
      return response;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  },
};

module.exports = apiService;
