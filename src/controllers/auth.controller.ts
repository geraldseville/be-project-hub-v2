import type { Request, Response } from 'express';

import bcrypt from 'bcrypt';

import { cookieOptions, generateToken } from '../lib/jwt';
import { authRepository } from '../repositories/auth.repository';
import type { LoginDto, RegisterDto } from '../types/auth.dto';

export const login = async (
  req: Request<{}, {}, LoginDto>,
  res: Response,
): Promise<void> => {
  const { email, password } = req.body;

  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    res.status(401).json({
      status: 'error',
      error: 'invalid email or password.',
    });

    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({
      status: 'error',
      error: 'invalid email or password.',
    });

    return;
  }

  generateToken(user.id, res);

  const { password: _, ...safeUser } = user;

  res.status(200).json({
    status: 'success',
    message: 'you are logged in.',
    data: {
      user: safeUser,
    },
  });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('jwt', cookieOptions);

  res.status(200).json({
    status: 'success',
    message: 'logged out successfully.',
  });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const user = await authRepository.findUserById(userId);

  if (!user) {
    res.status(404).json({
      status: 'error',
      message: 'user not found.',
    });

    return;
  }

  const { password: _, ...safeUser } = user;

  res.status(200).json({
    status: 'success',
    message: 'successfully retrieved current user.',
    data: {
      user: safeUser,
    },
  });
};

export const register = async (
  req: Request<{}, {}, RegisterDto>,
  res: Response,
): Promise<void> => {
  const { firstName, lastName, email, password, timezone } = req.body;

  const userExists = await authRepository.findUserByEmail(email);

  if (userExists) {
    res.status(400).json({
      status: 'error',
      message: 'user already exists with this email',
    });

    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    timezone,
  });

  generateToken(user.id, res);

  const { password: _, ...safeUser } = user;

  res.status(201).json({
    status: 'success',
    message: 'register successfully.',
    data: {
      user: safeUser,
    },
  });
};
