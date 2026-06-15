import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../types/express';
import { sendSuccess } from '../../utils/apiResponse';
import * as subscriptionService from './service';

export const getDoctorDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await subscriptionService.getDoctorDashboardStats(req.user!.doctorId!);
    sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await subscriptionService.getAdminDashboardStats();
    sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
};

export const getMySubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sub = await subscriptionService.getDoctorSubscription(req.user!.doctorId!);
    sendSuccess(res, sub);
  } catch (error) {
    next(error);
  }
};

export const getLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await subscriptionService.getActivityLogs();
    sendSuccess(res, logs);
  } catch (error) {
    next(error);
  }
};
