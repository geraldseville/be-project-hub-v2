import { notificationService } from '../services/notification.service';
import { notificationRepository } from '../repositories/notification.respository';

import type { Response } from 'express';
import type { AuthenticatedRequest } from '../types/auth.dto';

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const recipientId = req.user.id;

  const page = Number(req.query.page ?? 1);

  const limit = Number(req.query.limit ?? 20);

  const { notifications, pagination } =
    await notificationRepository.getNotifications({ recipientId, page, limit });

  return res.status(200).json({
    status: 'success',
    message: 'notifications fetch successfully',
    data: {
      notifications,
      pagination,
    },
  });
};

export const markNotificationAsRead = async (
  req: AuthenticatedRequest<{ notificationId: string }>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const recipientId = req.user.id;

  const { notificationId } = req.params;

  const result = await notificationService.markNotificationAsRead(
    notificationId,
    recipientId,
  );

  if (result.count === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'notification not found.',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'marked notification as read.',
  });
};

export const markNotificationsAsRead = async (
  req: AuthenticatedRequest<{}, {}, { notificationIds: string[] }>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const recipientId = req.user.id;

  const { notificationIds } = req.body;

  const result = await notificationService.markNotificationsAsRead(
    notificationIds,
    recipientId,
  );

  return res.status(200).json({
    status: 'success',
    message: 'mark notifications as read.',
    data: {
      count: result.count,
    },
  });
};

export const markAllNotificationsAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const recipientId = req.user.id;

  const result =
    await notificationService.markAllNotificationsAsRead(recipientId);

  return res.status(200).json({
    status: 'success',
    message: 'marked all notifications as read.',
    data: {
      count: result.count,
    },
  });
};
