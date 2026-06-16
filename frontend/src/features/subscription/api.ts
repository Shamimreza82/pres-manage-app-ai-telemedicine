import { api } from '@/lib/axios';
import { Plan, CreatePlanInput, UpdatePlanInput } from './types';

export const getPlans = () =>
  api.get<{ success: boolean; data: Plan[] }>('/admin/plans').then((r) => r.data.data);

export const getPlan = (id: string) =>
  api.get<{ success: boolean; data: Plan }>(`/admin/plans/${id}`).then((r) => r.data.data);

export const createPlan = (data: CreatePlanInput) =>
  api.post<{ success: boolean; data: Plan }>('/admin/plans', data).then((r) => r.data.data);

export const updatePlan = (id: string, data: UpdatePlanInput) =>
  api.put<{ success: boolean; data: Plan }>(`/admin/plans/${id}`, data).then((r) => r.data.data);

export const deletePlan = (id: string) =>
  api.delete<{ success: boolean; data: { message: string } }>(`/admin/plans/${id}`).then((r) => r.data.data);
