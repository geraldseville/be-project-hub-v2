import { type Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma';

export const notificationRepository = {
  createNotification(data: Prisma.NotificationCreateInput) {
    return prisma.notification.create({ data });
  },

  createNotifications(data: Prisma.NotificationCreateManyInput[]) {
    return prisma.$transaction(
      data.map((notification) =>
        prisma.notification.create({
          data: notification,
        }),
      ),
    );
  },

  async getNotifications({
    recipientId,
    page = 1,
    limit = 20,
  }: {
    recipientId: string;
    page?: number;
    limit?: number;
  }) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await prisma.$transaction([
      prisma.notification.findMany({
        where: {
          recipientId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),

      prisma.notification.count({
        where: {
          recipientId,
        },
      }),
    ]);

    const projectIds = notifications
      .filter((notification) => notification.entityType === 'PROJECT')
      .map((notification) => notification.entityId);

    const taskIds = notifications
      .filter((notification) => notification.entityType === 'TASK')
      .map((notification) => notification.entityId);

    const [projects, tasks] = await Promise.all([
      projectIds.length
        ? prisma.project.findMany({
            where: {
              id: {
                in: projectIds,
              },
            },
          })
        : [],

      taskIds.length
        ? prisma.task.findMany({
            where: {
              id: {
                in: taskIds,
              },
            },
          })
        : [],
    ]);

    const projectMap = new Map(
      projects.map((project) => [project.id, project]),
    );

    const taskMap = new Map(tasks.map((task) => [task.id, task]));

    const notificationsWithEntity = notifications.map((notification) => ({
      ...notification,

      ...(notification.entityType === 'PROJECT' && {
        project: projectMap.get(notification.entityId) ?? null,
      }),

      ...(notification.entityType === 'TASK' && {
        task: taskMap.get(notification.entityId) ?? null,
      }),
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      notifications: notificationsWithEntity,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  },

  getUnreadNotificationCount(recipientId: string) {
    return prisma.notification.count({
      where: {
        recipientId,
        readAt: null,
      },
    });
  },

  markNotificationAsRead(id: string, recipientId: string) {
    return prisma.notification.updateMany({
      where: {
        id,
        recipientId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  },

  markNotificationsAsRead(ids: string[], recipientId: string) {
    return prisma.notification.updateMany({
      where: {
        id: {
          in: ids,
        },
        recipientId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  },

  markAllNotificationsAsRead(recipientId: string) {
    return prisma.notification.updateMany({
      where: {
        recipientId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  },

  deleteNotification(id: string) {
    return prisma.notification.delete({
      where: { id },
    });
  },
};
