import { api } from '@/lib/axios';
import { PaginatedResponse } from '@/types';

export interface SearchDoctorsParams {
  q?: string;
  degree?: string;
  specialization?: string;
  page?: number;
  limit?: number;
}

export const searchDoctors = (params?: SearchDoctorsParams) =>
  api.get<PaginatedResponse<import('@/types').Doctor>>('/doctors/public/search', { params }).then((r) => r.data);

export const getDoctor = (id: string) =>
  api.get<{ success: boolean; data: import('@/types').Doctor }>(`/doctors/public/${id}`).then((r) => r.data.data);
