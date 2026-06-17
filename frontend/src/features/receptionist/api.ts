import { api } from '@/lib/axios';
import type { ReceptionistDashboardData, ReceptionistPatient, CreatePatientInput, Appointment, Prescription, PaginatedResponse } from './types';

export const getDashboard = () =>
  api.get<{ success: boolean; data: ReceptionistDashboardData }>('/receptionist/dashboard').then((r) => r.data.data);

export const getPatients = (params?: Record<string, string>) =>
  api.get<PaginatedResponse<ReceptionistPatient>>('/receptionist/patients', { params }).then((r) => r.data);

export const getPatient = (id: string) =>
  api.get<{ success: boolean; data: ReceptionistPatient }>(`/receptionist/patients/${id}`).then((r) => r.data.data);

export const createPatient = (data: CreatePatientInput) =>
  api.post<{ success: boolean; data: ReceptionistPatient }>('/receptionist/patients', data).then((r) => r.data);

export const updatePatient = (id: string, data: Partial<CreatePatientInput>) =>
  api.put<{ success: boolean; data: ReceptionistPatient }>(`/receptionist/patients/${id}`, data).then((r) => r.data);

export const getAppointments = (params?: Record<string, string>) =>
  api.get<PaginatedResponse<Appointment>>('/receptionist/appointments', { params }).then((r) => r.data);

export const getTodayAppointments = () =>
  api.get<{ success: boolean; data: Appointment[] }>('/receptionist/appointments/today').then((r) => r.data.data);

export const createAppointment = (data: { patientId: string; date: string; time: string; notes?: string }) =>
  api.post('/receptionist/appointments', data).then((r) => r.data);

export const updateAppointment = (id: string, data: { status?: string; notes?: string }) =>
  api.patch(`/receptionist/appointments/${id}`, data).then((r) => r.data);

export const getPrescriptions = (params?: Record<string, string>) =>
  api.get<PaginatedResponse<Prescription>>('/receptionist/prescriptions', { params }).then((r) => r.data);

export const getPrescription = (id: string) =>
  api.get<{ success: boolean; data: Prescription }>(`/receptionist/prescriptions/${id}`).then((r) => r.data.data);

export const downloadPrescriptionPDF = async (id: string): Promise<void> => {
  const response = await api.get(`/receptionist/prescriptions/${id}/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `prescription-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Doctor manages own receptionists
export const getMyReceptionists = (params?: { page?: number; limit?: number; search?: string }) =>
  api.get('/receptionist/my', { params }).then((r) => r.data);

export const createReceptionistByDoctor = (data: { email: string; password: string; fullName: string; phone: string }) =>
  api.post('/receptionist/my', data).then((r) => r.data.data);

export const toggleReceptionistStatus = (id: string) =>
  api.patch(`/receptionist/my/${id}/toggle-status`).then((r) => r.data);

export const updateReceptionistByDoctor = (id: string, data: { fullName?: string; phone?: string }) =>
  api.put(`/receptionist/my/${id}`, data).then((r) => r.data.data);

export const deleteReceptionistByDoctor = (id: string) =>
  api.delete(`/receptionist/my/${id}`).then((r) => r.data.data);

export const resetReceptionistPassword = (id: string, newPassword: string) =>
  api.post(`/receptionist/my/${id}/reset-password`, { newPassword }).then((r) => r.data);
