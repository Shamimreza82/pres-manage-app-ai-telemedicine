import { useQuery } from '@tanstack/react-query';
import { searchMedicines, searchLabTests } from './api';

export const useMedicineSearch = (q: string) =>
  useQuery({
    queryKey: ['medicines', 'search', q],
    queryFn: () => searchMedicines(q),
    enabled: q.length >= 2,
    staleTime: 60_000,
  });

export const useLabTestSearch = (q: string) =>
  useQuery({
    queryKey: ['lab-tests', 'search', q],
    queryFn: () => searchLabTests(q),
    enabled: q.length >= 2,
    staleTime: 60_000,
  });
