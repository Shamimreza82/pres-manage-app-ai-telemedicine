import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as subscriptionApi from './api';
import { CreatePlanInput, UpdatePlanInput } from './types';

export const subscriptionKeys = {
  plans: ['plans'] as const,
  plan: (id: string) => ['plans', id] as const,
};

export const usePlans = () =>
  useQuery({
    queryKey: subscriptionKeys.plans,
    queryFn: subscriptionApi.getPlans,
  });

export const usePlan = (id: string) =>
  useQuery({
    queryKey: subscriptionKeys.plan(id),
    queryFn: () => subscriptionApi.getPlan(id),
    enabled: !!id,
  });

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePlanInput) => subscriptionApi.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plans });
      toast.success('Plan created successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create plan');
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanInput }) =>
      subscriptionApi.updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plans });
      toast.success('Plan updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update plan');
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionApi.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plans });
      toast.success('Plan deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete plan');
    },
  });
};
