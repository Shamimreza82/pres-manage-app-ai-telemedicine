import { AuthRequest } from '../../types/express';
import { sendSuccess, sendPaginated } from '../../utils/apiResponse';
import { createAuditLog } from '../../utils/auditLogger';
import { catchAsync } from '../../utils/catchAsync';
import * as subscriptionService from './service';

export const getDoctorDashboard = catchAsync(async (req: AuthRequest, res) => {
  const stats = await subscriptionService.getDoctorDashboardStats(req.user!.doctorId!);
  sendSuccess(res, stats);
});

export const getAdminDashboard = catchAsync(async (req: AuthRequest, res) => {
  const stats = await subscriptionService.getAdminDashboardStats();
  sendSuccess(res, stats);
});

export const getMySubscription = catchAsync(async (req: AuthRequest, res) => {
  const sub = await subscriptionService.getDoctorSubscription(req.user!.doctorId!);
  sendSuccess(res, sub);
});

export const getLogs = catchAsync(async (req: AuthRequest, res) => {
  const [logs, total] = await subscriptionService.getActivityLogs(req.query);
  const { page, limit } = req.query;
  sendPaginated(res, logs, total, Number(page) || 1, Number(limit) || 20);
});

export const getAdminDoctors = catchAsync(async (req: AuthRequest, res) => {
  const [doctors, total] = await subscriptionService.getAdminDoctors(req.query);
  const { page, limit } = req.query;
  sendPaginated(res, doctors, total, Number(page) || 1, Number(limit) || 20);
});

export const getAdminUsers = catchAsync(async (req: AuthRequest, res) => {
  const [users, total] = await subscriptionService.getAdminUsers(req.query);
  const { page, limit } = req.query;
  sendPaginated(res, users, total, Number(page) || 1, Number(limit) || 20);
});

export const getAdminSubscriptions = catchAsync(async (req: AuthRequest, res) => {
  const [subscriptions, total] = await subscriptionService.getAdminSubscriptions(req.query);
  const { page, limit } = req.query;
  sendPaginated(res, subscriptions, total, Number(page) || 1, Number(limit) || 20);
});

export const deleteLogs = catchAsync(async (req: AuthRequest, res) => {
  const { startDate, endDate } = req.query as { startDate: string; endDate: string };
  const result = await subscriptionService.deleteActivityLogs(startDate, endDate);
  sendSuccess(res, { deleted: result.count }, 200);
});

export const activate = catchAsync(async (req: AuthRequest, res) => {
  const sub = await subscriptionService.activateSubscription(req.user!.doctorId!, req.body.planId);
  await createAuditLog({
    userId: req.user!.userId,
    action: 'CREATE',
    entity: 'Subscription',
    entityId: sub.id,
    details: { planId: req.body.planId, doctorId: req.user!.doctorId },
  });
  sendSuccess(res, sub);
});

export const deleteLog = catchAsync(async (req: AuthRequest, res) => {
  await subscriptionService.deleteActivityLog(req.params.id as string);
  sendSuccess(res, { message: 'Log deleted' });
});

export const deleteLogsBulk = catchAsync(async (req: AuthRequest, res) => {
  const { ids } = req.body as { ids: string[] };
  const result = await subscriptionService.deleteActivityLogsBulk(ids);
  sendSuccess(res, { deleted: result.count });
});

export const getAdminPatients = catchAsync(async (req: AuthRequest, res) => {
  const [patients, total] = await subscriptionService.getAdminPatients(req.query);
  const { page, limit } = req.query;
  sendPaginated(res, patients, total, Number(page) || 1, Number(limit) || 20);
});
