import { prisma } from '../lib/prisma.js';

import type { Prisma } from '@prisma/client';

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

  async getUsers({
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

    const [users, total] = await prisma.$transaction([
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

    const totalPages = Math.ceil(total / limit);

    return {
      users,
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
