import { db } from '../../config/database';
import { CreateNotificationInput } from './types';

export const createNotification = (data: CreateNotificationInput) =>
  db.notification.create({ data });

export const findNotificationsByUser = (userId: string) =>
  db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

export const markAsRead = (id: string, userId: string) =>
  db.notification.updateMany({ where: { id, userId }, data: { isRead: true } });

export const countUnread = (userId: string) =>
  db.notification.count({ where: { userId, isRead: false } });
