import {
  NotificationEntityType,
  NotificationType,
  Prisma,
} from '@prisma/client';

import { notificationRepository } from '../repositories/notification.respository';

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
  createNotification({
    recipientId,
    actorId,
    type,
    entityType,
    entityId,
    title,
    message,
    metadata,
  }: CreateNotificationParams) {
    return notificationRepository.createNotification({
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
  },

  createNotifications(notifications: CreateNotificationParams[]) {
    return notificationRepository.createNotifications(
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
