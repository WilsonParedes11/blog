import { defineStore } from 'pinia';
import api from '@/services/api';

export const usePostStore = defineStore('posts', {
  state: () => ({
    posts: [],
    post: null,
    isLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 0
    }
  }),

  actions: {
    async fetchPosts(page = 1, category = null) {
      this.isLoading = true;
      try {
        let url = `/posts?page=${page}`;
        if (category) {
          url += `&category=${category}`;
        }

        const response = await api.get(url);
        this.posts = response.data.data;
        this.pagination = {
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          perPage: response.data.per_page,
          total: response.data.total
        };
        return response;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPost(id) {
      this.isLoading = true;
      try {
        const response = await api.get(`/posts/${id}`);
        this.post = response.data;
        return response;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createPost(postData) {
      this.isLoading = true;
      try {
        const response = await api.post('/posts', postData);
        return response;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updatePost(id, postData) {
      this.isLoading = true;
      try {
        const response = await api.put(`/posts/${id}`, postData);
        return response;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deletePost(id) {
      this.isLoading = true;
      try {
        const response = await api.delete(`/posts/${id}`);
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
