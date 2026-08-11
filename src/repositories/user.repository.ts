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
    });
  },

  getAllUsers({ excludeUserId }: { excludeUserId?: string }) {
    return prisma.user.findMany({
      where: excludeUserId
        ? {
            id: {
              not: excludeUserId,
            },
          }
        : undefined,
      include: {
        memberProjects: true,
      },
      omit: {
        password: true,
      },
    });
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
