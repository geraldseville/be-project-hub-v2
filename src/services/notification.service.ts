import {
  NotificationEntityType,
  NotificationType,
  Prisma,
} from '@prisma/client';

import { notificationRepository } from '../repositories/notification.respository';

import { emitToUser } from '../socket/socket.gateway';
interface CreateNotificationParams {
  recipientId: string;
  actorId?: string;
  type: NotificationType;
  entityType: NotificationEntityType;
  entityId: string;
  title: string;
  message?: string;
  metadata?: Prisma.InputJsonValue;
}

export const notificationService = {
  async createNotification({
    recipientId,
    actorId,
    type,
    entityType,
    entityId,
    title,
    message,
    metadata,
  }: CreateNotificationParams) {
    const notification = await notificationRepository.createNotification({
      recipient: {
        connect: {
          id: recipientId,
        },
      },

      ...(actorId && {
        actor: {
          connect: {
            id: actorId,
          },
        },
      }),

      type,
      entityType,
      entityId,
      title,
      message,
      metadata,
    });

    emitToUser(notification.recipientId, 'notification:new', notification);

    return notification;
  },

  async createNotifications(notifications: CreateNotificationParams[]) {
    const createdNotifications =
      await notificationRepository.createNotifications(
        notifications.map((notification) => ({
          recipientId: notification.recipientId,
          actorId: notification.actorId,
          type: notification.type,
          entityType: notification.entityType,
          entityId: notification.entityId,
          title: notification.title,
          message: notification.message,
          metadata: notification.metadata,
        })),
      );

    createdNotifications.forEach((notification) => {
      emitToUser(notification.recipientId, 'notification:new', notification);
    });

    return createdNotifications;
  },

  markNotificationAsRead(id: string, recipientId: string) {
    return notificationRepository.markNotificationAsRead(id, recipientId);
  },

  markNotificationsAsRead(ids: string[], recipientId: string) {
    return notificationRepository.markNotificationsAsRead(ids, recipientId);
  },

  markAllNotificationsAsRead(recipientId: string) {
    return notificationRepository.markAllNotificationsAsRead(recipientId);
  },
};
