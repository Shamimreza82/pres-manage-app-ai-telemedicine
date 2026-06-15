import { api } from '@/lib/axios';
import { DoctorDashboardData, AdminDashboardData } from './types';

export const getDoctorDashboard = () =>
  api.get<{ success: boolean; data: DoctorDashboardData }>('/stats/doctor').then((r) => r.data.data);

export const getAdminDashboard = () =>
  api.get<{ success: boolean; data: AdminDashboardData }>('/stats/admin').then((r) => r.data.data);
