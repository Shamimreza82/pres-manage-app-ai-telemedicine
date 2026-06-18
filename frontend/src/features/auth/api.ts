import { api } from '@/lib/axios';
export const login = (data: { email: string; password: string }) =>
  api.post<{ success: boolean; data: { user: any; tokens: { accessToken: string; refreshToken: string } } }>('/auth/login', data).then((r) => r.data);

export const register = (data: { email: string; password: string; fullName: string }) =>
  api.post<{ success: boolean; data: { user: any; tokens: { accessToken: string; refreshToken: string } } }>('/auth/register', data).then((r) => r.data);

export const logout = () =>
  api.post('/auth/logout');
