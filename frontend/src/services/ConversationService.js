/**
 * Conversation Service
 * Handles API communication for chat functionality
 */

import axios from 'axios';

export class ConversationService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.apiClient.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.apiClient.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error.response?.data || error.message);
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        message: 'Unable to connect to server. Please check your connection.',
        status: 0,
        data: null
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
        data: null
      };
    }
  }

  async sendMessage(messageData) {
    try {
      const response = await this.apiClient.post('/conversations/message', {
        message: messageData.message,
        conversationId: messageData.conversationId
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getConversationHistory(sessionId = null) {
    try {
      const endpoint = sessionId 
        ? `/conversations/history/${sessionId}`
        : '/conversations/history';
      
      const response = await this.apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async clearConversation(sessionId) {
    try {
      const response = await this.apiClient.delete(`/conversations/session/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Health check method
  async checkApiHealth() {
    try {
      const response = await this.apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}