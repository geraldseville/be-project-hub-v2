import type { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma';

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

  getTasks() {
    return prisma.task.findMany();
  },

  async getTasksPaginated({
    page = 1,
    limit = 20,
  }: {
    page: number;
    limit: number;
  }) {
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      prisma.task.count(),
    ]);

    return {
      tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
