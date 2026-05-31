// src/utils/api/auth.ts
import api from './api';
import { jwtDecode } from 'jwt-decode';

export default {
  async login(username: string, password: string) {
    const response = await api.post('/token/', { username, password });
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post('/token/refresh/', { refresh: refreshToken });
    return response.data;
  },

  decodeToken(token: string) {
    return jwtDecode(token);
  }
};