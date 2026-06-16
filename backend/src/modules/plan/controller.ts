import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../types/express';
import { sendSuccess } from '../../utils/apiResponse';
import * as service from './service';

export const getAll = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const plans = await service.getAllPlans();
    sendSuccess(res, plans);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const plan = await service.getPlanById(req.params.id as string);
    sendSuccess(res, plan);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const plan = await service.createPlan(req.body);
    sendSuccess(res, plan, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const plan = await service.updatePlan(req.params.id as string, req.body);
    sendSuccess(res, plan);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await service.deletePlan(req.params.id as string);
    sendSuccess(res, { message: 'Plan deleted' });
  } catch (error) {
    next(error);
  }
};
