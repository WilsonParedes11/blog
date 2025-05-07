import { defineStore } from 'pinia';
import api from '@/services/api';

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchCategories() {
      this.isLoading = true;
      try {
        const response = await api.get('/categories');
        this.categories = response.data;
        return response;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createCategory(name) {
      this.isLoading = true;
      try {
        const response = await api.post('/categories', { name });
        this.categories.push(response.data);
        return response;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
