import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  actions: {
    async register(userData) {
      try {
        const response = await api.post('/register', userData);
        this.setAuthData(response.data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async login(credentials) {
      try {
        const response = await api.post('/login', credentials);
        this.setAuthData(response.data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async logout() {
      try {
        await api.post('/logout');
      } finally {
        this.clearAuthData();
      }
    },

    setAuthData(data) {
      this.user = data.user;
      this.token = data.token;
      this.isAuthenticated = true;
      localStorage.setItem('token', data.token);
    },

    clearAuthData() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  }
});
