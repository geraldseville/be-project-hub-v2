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

    const where = {
      taskId,
    };

    const [taskActivities, total] = await prisma.$transaction([
      prisma.taskActivity.findMany({
        where,
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
        orderBy: [
          {
            createdAt: 'desc',
          },
          {
            id: 'desc',
          },
        ],
        skip,
        take: limit,
      }),

      prisma.taskActivity.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      taskActivities,
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
};
