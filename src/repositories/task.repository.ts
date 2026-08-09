import { type Prisma } from '@prisma/client';

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

  getAllTasks() {
    return prisma.task.findMany();
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
