import { api } from '@/lib/axios';
import { Patient, CreatePatientInput, PaginatedResponse } from './types';

export const getPatients = (params?: Record<string, string>) =>
  api.get<PaginatedResponse<Patient>>('/patients', { params }).then((r) => r.data);

export const getPatient = (id: string) =>
  api.get<{ success: boolean; data: Patient }>(`/patients/${id}`).then((r) => r.data.data);

export const createPatient = (data: CreatePatientInput) =>
  api.post<{ success: boolean; data: Patient }>('/patients', data).then((r) => r.data);

export const updatePatient = (id: string, data: Partial<CreatePatientInput>) =>
  api.put<{ success: boolean; data: Patient }>(`/patients/${id}`, data).then((r) => r.data);

export const deletePatient = (id: string) =>
  api.delete(`/patients/${id}`);
