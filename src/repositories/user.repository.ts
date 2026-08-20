import { type Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma';

export const usersRepository = {
  deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },

  findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        ownedProjects: {
          include: {
            tasks: true,
            members: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
        },
        memberProjects: {
          include: {
            tasks: true,
            members: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
  },

  getUsers({
    excludeUserId,
    page = 1,
    limit = 20,
  }: {
    excludeUserId?: string;
    page?: number;
    limit?: number;
  }) {
    const skip = (page - 1) * limit;

    const where = excludeUserId
      ? {
          id: {
            not: excludeUserId,
          },
        }
      : undefined;

    return prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          memberProjects: true,
        },
        omit: {
          password: true,
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);
  },

  updateUser(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  updateUserSavedColors(userId: string, savedColors: string[]) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        savedColors,
      },
      omit: {
        password: true,
      },
    });
  },
};
