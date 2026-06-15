'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as patientApi from './api';

export const patientKeys = {
  all: ['patients'] as const,
  list: (params?: Record<string, string>) => ['patients', 'list', params] as const,
  detail: (id: string) => ['patients', id] as const,
};

export const usePatients = (params?: Record<string, string>) =>
  useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientApi.getPatients(params),
  });

export const usePatient = (id: string) =>
  useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientApi.getPatient(id),
    enabled: !!id,
  });

export const useCreatePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patientApi.createPatient,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientKeys.all });
      toast.success('Patient created successfully');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create patient'),
  });
};

export const useUpdatePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => patientApi.updatePatient(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: patientKeys.all });
      qc.invalidateQueries({ queryKey: patientKeys.detail(vars.id) });
      toast.success('Patient updated');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Update failed'),
  });
};

export const useDeletePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patientApi.deletePatient,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientKeys.all });
      toast.success('Patient deleted');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Delete failed'),
  });
};
