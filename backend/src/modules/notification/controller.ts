import { AuthRequest } from '../../types/express';
import { sendSuccess } from '../../utils/apiResponse';
import { catchAsync } from '../../utils/catchAsync';
import * as notificationService from './service';

export const getAll = catchAsync(async (req: AuthRequest, res) => {
  const notifications = await notificationService.getUserNotifications(req.user!.userId);
  sendSuccess(res, notifications);
});

export const markRead = catchAsync(async (req: AuthRequest, res) => {
  await notificationService.readNotification(req.params.id as string, req.user!.userId);
  sendSuccess(res, { message: 'Marked as read' });
});

export const getUnread = catchAsync(async (req: AuthRequest, res) => {
  const count = await notificationService.getUnreadCount(req.user!.userId);
  sendSuccess(res, { count });
});
