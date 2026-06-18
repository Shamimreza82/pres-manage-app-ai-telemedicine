import * as repo from './repository';
import { CreateNotificationInput } from './types';

export const getUserNotifications = (userId: string) =>
  repo.findNotificationsByUser(userId);

export const readNotification = (id: string, userId: string) =>
  repo.markAsRead(id, userId);

export const getUnreadCount = (userId: string) =>
  repo.countUnread(userId);
