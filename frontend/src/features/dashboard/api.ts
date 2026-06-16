import { api } from '@/lib/axios';
import { DoctorDashboardData, AdminDashboardData } from './types';

export const getDoctorDashboard = () =>
  api.get<{ success: boolean; data: DoctorDashboardData }>('/stats/doctor').then((r) => r.data.data);

export const getAdminDashboard = () =>
  api.get<{ success: boolean; data: AdminDashboardData }>('/stats/admin').then((r) => r.data.data);

export const getAdminDoctors = (params?: { page?: number; limit?: number; search?: string }) =>
  api.get('/stats/admin/doctors', { params }).then((r) => r.data);

export const getAdminUsers = (params?: { page?: number; limit?: number; search?: string }) =>
  api.get('/stats/admin/users', { params }).then((r) => r.data);

export const getAdminSubscriptions = (params?: { page?: number; limit?: number; search?: string }) =>
  api.get('/stats/admin/subscriptions', { params }).then((r) => r.data);

export const getAdminPatients = (params?: { page?: number; limit?: number; search?: string }) =>
  api.get('/stats/admin/patients', { params }).then((r) => r.data);

export const getAdminLogs = (params?: { page?: number; limit?: number; search?: string }) =>
  api.get('/stats/logs', { params }).then((r) => r.data);
