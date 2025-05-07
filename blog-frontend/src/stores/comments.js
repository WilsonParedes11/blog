import { defineStore } from 'pinia';
import api from '@/services/api';

export const useCommentStore = defineStore('comments', {
  state: () => ({
    comments: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchComments(postId) {
      this.isLoading = true;
      try {
        const response = await api.get(`/posts/${postId}/comments`);
        this.comments = response.data;
        return response;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createComment(postId, content) {
      this.isLoading = true;
      try {
        const response = await api.post(`/posts/${postId}/comments`, { content });
        this.comments.unshift(response.data);
        return response;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteComment(commentId) {
      this.isLoading = true;
      try {
        const response = await api.delete(`/comments/${commentId}`);
        this.comments = this.comments.filter(comment => comment.id !== commentId);
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
