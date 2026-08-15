import type { Prisma, TaskActivityType } from '@prisma/client';

import { prisma } from '../lib/prisma';

interface CreateTaskActivityInput {
  taskId: string;
  actorId: string;
  type: TaskActivityType;
  metadata?: Prisma.InputJsonValue;
}

interface GetTaskActivitiesInput {
  taskId: string;
  page?: number;
  limit?: number;
}

export const taskActivityRepository = {
  createTaskActivity({
    taskId,
    actorId,
    type,
    metadata,
  }: CreateTaskActivityInput) {
    return prisma.taskActivity.create({
      data: {
        task: {
          connect: {
            id: taskId,
          },
        },
        actor: {
          connect: {
            id: actorId,
          },
        },
        type,
        metadata,
      },
    });
  },

  async getTaskActivities({
    taskId,
    page = 1,
    limit = 20,
  }: GetTaskActivitiesInput) {
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.taskActivity.findMany({
        where: {
          taskId,
        },
        include: {
          actor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),

      prisma.taskActivity.count({
        where: {
          taskId,
        },
      }),
    ]);

    return {
      activities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};
