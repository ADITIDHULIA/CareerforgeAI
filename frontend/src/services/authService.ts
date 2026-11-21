import { api } from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string; targetRole?: string; targetCompany?: string }): Promise<AuthResponse> {
    const response = await api.post<any>('/auth/register', data);
    const payload = response.data?.data || response.data;
    return {
      token: payload.token || response.data?.token,
      user: payload.user || response.data?.user,
    };
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await api.post<any>('/auth/login', data);
    const payload = response.data?.data || response.data;
    return {
      token: payload.token || response.data?.token,
      user: payload.user || response.data?.user,
    };
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  },

  async updateProfile(data: { name?: string; targetRole?: string; targetCompany?: string; bio?: string; currentPassword?: string; newPassword?: string }): Promise<User> {
    const response = await api.put<{ user: User }>('/auth/profile', data);
    return response.data.user;
  },

  logout(): void {
    localStorage.removeItem('careerforge_token');
    localStorage.removeItem('careerforge_user');
  },
};
