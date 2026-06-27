import { useQuery } from '@tanstack/react-query';
import * as doctorApi from './api';

export const doctorKeys = {
  search: (params?: doctorApi.SearchDoctorsParams) => ['doctors', 'search', params] as const,
  detail: (id: string) => ['doctors', id] as const,
};

export const useDoctorSearch = (params?: doctorApi.SearchDoctorsParams, enabled = true) =>
  useQuery({
    queryKey: doctorKeys.search(params),
    queryFn: () => doctorApi.searchDoctors(params),
    enabled,
  });

export const useDoctor = (id: string) =>
  useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => doctorApi.getDoctor(id),
    enabled: !!id,
  });
