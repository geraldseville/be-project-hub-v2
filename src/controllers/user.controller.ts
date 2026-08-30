import bcrypt from 'bcryptjs';

import { usersRepository } from '../repositories/user.repository';

import type { Response } from 'express';
import type { AuthenticatedRequest } from '../types/auth.dto';
import type {
  ChangeUserPasswordDto,
  UpdateUserDto,
  UpdateUserSavedColorsDto,
} from '../types/user.dto';

export const changeMyPassword = async (
  req: AuthenticatedRequest<{}, {}, ChangeUserPasswordDto>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized',
    });
  }

  const userId = req.user.id;

  const { newPassword } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await usersRepository.updateUser(userId, {
    password: hashedPassword,
    updatedAt: new Date(),
  });

  return res.status(200).json({
    status: 'success',
    message: 'password changed successfully.',
  });
};

export const deleteMyAccount = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const userId = req.user.id;

  const user = await usersRepository.findUserById(userId);

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'user not found.',
    });
  }

  await usersRepository.deleteUser(userId);

  res.clearCookie('jwt');

  return res.status(200).json({
    status: 'success',
    message: 'account deleted successfully.',
  });
};

export const getUsers = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const userId = req.user.id;
  const excludeMe = req.query.excludeMe === 'true';

  const pageParam = Number(req.query.page ?? 1);
  const limitParam = Number(req.query.limit ?? 20);

  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const limit =
    Number.isInteger(limitParam) && limitParam > 0
      ? Math.min(limitParam, 100)
      : 20;

  const { users, pagination } = await usersRepository.getUsers({
    excludeUserId: excludeMe ? userId : undefined,
    page,
    limit,
  });

  return res.status(200).json({
    status: 'success',
    message: 'successfully fetched users.',
    data: {
      users,
      pagination,
    },
  });
};

export const getUser = async (
  req: AuthenticatedRequest<{ userId: string }>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized',
    });
  }

  const { userId } = req.params;

  const user = await usersRepository.findUserById(userId);

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'user not found',
    });
  }

  const { password: _, ...safeUser } = user;

  return res.status(200).json({
    status: 'success',
    message: 'successfully fetched user.',
    data: {
      user: safeUser,
    },
  });
};

export const updateMe = async (
  req: AuthenticatedRequest<{}, {}, UpdateUserDto>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const userId = req.user.id;

  const { firstName, lastName, role, bio, imageUrl, timezone, timeFormat } =
    req.body;

  const user = await usersRepository.findUserById(userId);

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'user not found.',
    });
  }

  const updateData: Record<string, unknown> = {
    ...(firstName !== undefined && { firstName }),
    ...(lastName !== undefined && { lastName }),
    ...(bio !== undefined && { bio }),
    ...(role !== undefined && { role }),
    ...(imageUrl !== undefined && { imageUrl }),
    ...(timezone !== undefined && { timezone }),
    ...(timeFormat !== undefined && { timeFormat }),
  };

  const updatedUser = await usersRepository.updateUser(userId, updateData);

  const { password: _, ...safeUser } = updatedUser;

  return res.status(200).json({
    status: 'success',
    message: 'user updated successfully.',
    data: {
      user: safeUser,
    },
  });
};

export const updateMySavedColors = async (
  req: AuthenticatedRequest<{}, {}, UpdateUserSavedColorsDto>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const userId = req.user.id;

  const colors = req.body.savedColors;

  const user = await usersRepository.updateUserSavedColors(userId, colors);

  return res.status(200).json({
    status: 'success',
    message: 'saved colors successfully updated.',
    data: {
      user,
    },
  });
};
