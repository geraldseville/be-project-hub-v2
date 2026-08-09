import type { Request, Response } from 'express';

import bcrypt from 'bcryptjs';

import { usersRepository } from '../repositories/user.repository';
import type { ChangeUserPasswordDto, UpdateUserDto } from '../types/user.dto';

export const changeMyPassword = async (
  req: Request<{}, {}, ChangeUserPasswordDto>,
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
  req: Request,
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
  _: Request,
  res: Response,
): Promise<Response | void> => {
  const users = await usersRepository.getAllUsers();

  return res.status(200).json({
    status: 'success',
    message: 'Successfully fetched all users.',
    data: {
      users,
    },
  });
};

export const updateMe = async (
  req: Request<{}, {}, UpdateUserDto>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized.',
    });
  }

  const userId = req.user.id;

  const { firstName, lastName, role, bio, imageUrl, timezone } = req.body;

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
