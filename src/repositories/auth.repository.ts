import { prisma } from '../lib/prisma.js';

import type { Prisma } from '@prisma/client';

export const authRepository = {
  createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  },

  findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  findUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  },
};
