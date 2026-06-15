import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../types/express';
import { sendSuccess } from '../../utils/apiResponse';
import * as notificationService from './service';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user!.userId);
    sendSuccess(res, notifications);
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await notificationService.readNotification(req.params.id as string, req.user!.userId);
    sendSuccess(res, { message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};

export const getUnread = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const count = await notificationService.getUnreadCount(req.user!.userId);
    sendSuccess(res, { count });
  } catch (error) {
    next(error);
  }
};
