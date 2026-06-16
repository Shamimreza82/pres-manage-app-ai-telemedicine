import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from './api';

export const dashboardKeys = {
  doctor: ['dashboard', 'doctor'] as const,
  admin: ['dashboard', 'admin'] as const,
  adminDoctors: ['dashboard', 'admin', 'doctors'] as const,
  adminUsers: ['dashboard', 'admin', 'users'] as const,
  adminSubscriptions: ['dashboard', 'admin', 'subscriptions'] as const,
};

export const useDoctorDashboard = () =>
  useQuery({
    queryKey: dashboardKeys.doctor,
    queryFn: dashboardApi.getDoctorDashboard,
  });

export const useAdminDashboard = () =>
  useQuery({
    queryKey: dashboardKeys.admin,
    queryFn: dashboardApi.getAdminDashboard,
  });

export const useAdminDoctors = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: [...dashboardKeys.adminDoctors, params],
    queryFn: () => dashboardApi.getAdminDoctors(params),
  });

export const useAdminUsers = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: [...dashboardKeys.adminUsers, params],
    queryFn: () => dashboardApi.getAdminUsers(params),
  });

export const useAdminSubscriptions = (params?: { page?: number; limit?: number; search?: string; status?: string; planId?: string }) =>
  useQuery({
    queryKey: [...dashboardKeys.adminSubscriptions, params],
    queryFn: () => dashboardApi.getAdminSubscriptions(params),
  });

export const useAdminPatients = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: [...dashboardKeys.admin, 'patients', params],
    queryFn: () => dashboardApi.getAdminPatients(params),
  });

export const useAdminLogs = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: [...dashboardKeys.admin, 'logs', params],
    queryFn: () => dashboardApi.getAdminLogs(params),
  });
