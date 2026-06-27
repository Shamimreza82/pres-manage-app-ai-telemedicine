import { AuthRequest } from '../../types/express';
import { sendSuccess } from '../../utils/apiResponse';
import { catchAsync } from '../../utils/catchAsync';
import * as service from './service';

export const getAll = catchAsync(async (_req: AuthRequest, res) => {
  const plans = await service.getAllPlans();
  sendSuccess(res, plans);
});

export const getById = catchAsync(async (req: AuthRequest, res) => {
  const plan = await service.getPlanById(req.params.id as string);
  sendSuccess(res, plan);
});

export const create = catchAsync(async (req: AuthRequest, res) => {
  const plan = await service.createPlan(req.body);
  sendSuccess(res, plan, 201);
});

export const update = catchAsync(async (req: AuthRequest, res) => {
  const plan = await service.updatePlan(req.params.id as string, req.body);
  sendSuccess(res, plan);
});

export const remove = catchAsync(async (req: AuthRequest, res) => {
  await service.deletePlan(req.params.id as string);
  sendSuccess(res, { message: 'Plan deleted' });
});
