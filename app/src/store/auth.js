import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async register(email, password) {
      try {
        const response = await api.post('/auth/register', { email, password });
        this.setAuth(response.data);
      } catch (error) {
        throw error.response?.data?.error || 'Registration failed';
      }
    },
    async login(email, password) {
      try {
        const response = await api.post('/auth/login', { email, password });
        this.setAuth(response.data);
      } catch (error) {
        throw error.response?.data?.error || 'Login failed';
      }
    },
    setAuth({ user, token }) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});
