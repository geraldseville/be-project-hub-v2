import { prisma } from '../lib/prisma.js';

import type { Prisma } from '@prisma/client';

export const projectRepository = {
  createProject(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({
      data,
      include: {
        owner: true,
        members: true,
        tasks: {
          include: {
            assignee: true,
          },
        },
      },
    });
  },

  deleteProjectById(id: string) {
    return prisma.project.delete({ where: { id } });
  },

  getAllProjects() {
    return prisma.project.findMany({
      include: {
        owner: true,
        members: true,
        tasks: {
          include: {
            assignee: true,
          },
        },
      },
    });
  },

  getProjectById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        members: true,
        tasks: {
          include: {
            assignee: true,
          },
        },
      },
    });
  },

  updateProjectById(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        owner: true,
        members: true,
        tasks: {
          include: {
            assignee: true,
          },
        },
      },
    });
  },
};
