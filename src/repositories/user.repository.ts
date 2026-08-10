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

  getAllUsers() {
    return prisma.user.findMany({
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
};
