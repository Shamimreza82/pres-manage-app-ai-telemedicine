import { api } from '@/lib/axios';
import { LoginInput, RegisterInput, AuthResponse } from './types';

export const login = (data: LoginInput) =>
  api.post<AuthResponse>('/auth/login', data).then((r) => r.data);

export const register = (data: RegisterInput) =>
  api.post<AuthResponse>('/auth/register', data).then((r) => r.data);

export const getMe = () =>
  api.get<{ success: boolean; data: any }>('/auth/me').then((r) => r.data.data);

export const logout = () =>
  api.post('/auth/logout');

export const changePassword = (data: { currentPassword: string; newPassword: string }) =>
  api.post('/auth/change-password', data);
