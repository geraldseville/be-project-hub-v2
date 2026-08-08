import { type Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma';

export const projectRepository = {
  createProject(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({
      data,
      include: {
        owner: true,
        // assignees: true,
        members: true,
        // tasks: true,
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
        // assignees: true,
        members: true,
        // tasks: true,
      },
    });
  },

  getProjectById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        // assignees: true,
        members: true,
        // tasks: true,
      },
    });
  },

  updateProjectById(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        owner: true,
        // assignees: true,
        members: true,
        // tasks: true,
      },
    });
  },
};
