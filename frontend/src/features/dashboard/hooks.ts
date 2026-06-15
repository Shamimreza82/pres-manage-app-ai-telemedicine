import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from './api';

export const dashboardKeys = {
  doctor: ['dashboard', 'doctor'] as const,
  admin: ['dashboard', 'admin'] as const,
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
