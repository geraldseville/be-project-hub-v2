import { prisma } from '../lib/prisma.js';

import type { Prisma } from '@prisma/client';

export const taskRepository = {
  createTask(data: Prisma.TaskCreateInput) {
    return prisma.task.create({
      data,
    });
  },

  deleteTaskById(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  },

  async getTasks({ page = 1, limit = 20 }: { page?: number; limit?: number }) {
    const skip = (page - 1) * limit;

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        skip,
        take: limit,
        include: {
          assignee: true,
        },
      }),

      prisma.task.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      tasks,
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

  async getTasksByProjectId({
    projectId,
    page = 1,
    limit = 20,
  }: {
    projectId: string;
    page?: number;
    limit?: number;
  }) {
    const skip = (page - 1) * limit;

    const where = {
      projectId,
    };

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignee: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      prisma.task.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      tasks,
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

  getTaskById(id: string) {
    return prisma.task.findUnique({
      where: { id },
    });
  },

  updateTaskById(id: string, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({
      where: { id },
      data,
    });
  },
};
