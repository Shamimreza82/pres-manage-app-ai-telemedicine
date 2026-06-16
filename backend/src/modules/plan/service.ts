import { notFound, badRequest } from '../../utils/errors';
import * as repo from './repository';
import type { CreatePlanInput, UpdatePlanInput } from './types';

export const getAllPlans = () => repo.findAll();

export const getPlanById = async (id: string) => {
  const plan = await repo.findById(id);
  if (!plan) throw notFound('Plan not found');
  return plan;
};

export const createPlan = (input: CreatePlanInput) =>
  repo.create(input);

export const updatePlan = async (id: string, input: UpdatePlanInput) => {
  const plan = await repo.findById(id);
  if (!plan) throw notFound('Plan not found');
  return repo.update(id, input);
};

export const deletePlan = async (id: string) => {
  const plan = await repo.findById(id);
  if (!plan) throw notFound('Plan not found');
  return repo.remove(id);
};
