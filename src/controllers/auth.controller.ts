import bcrypt from 'bcrypt';

import { cookieOptions, generateToken } from '../lib/jwt';
import { authRepository } from '../repositories/auth.repository';

import type { Response } from 'express';
import type {
  AuthenticatedRequest,
  LoginDto,
  RegisterDto,
} from '../types/auth.dto';

export const login = async (
  req: AuthenticatedRequest<{}, {}, LoginDto>,
  res: Response,
): Promise<Response | void> => {
  const { email, password } = req.body;

  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    return res.status(401).json({
      status: 'error',
      error: 'invalid email or password.',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      status: 'error',
      error: 'invalid email or password.',
    });
  }

  generateToken(user.id, res);

  const { password: _, ...safeUser } = user;

  return res.status(200).json({
    status: 'success',
    message: 'you are logged in.',
    data: {
      user: safeUser,
    },
  });
};

export const logout = async (
  _req: AuthenticatedRequest,
  res: Response,
): Promise<Response | void> => {
  res.clearCookie('jwt', cookieOptions);

  return res.status(200).json({
    status: 'success',
    message: 'logged out successfully.',
  });
};

export const me = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<Response | void> => {
  const userId = req.user!.id;

  const user = await authRepository.findUserById(userId);

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'user not found.',
    });
  }

  const { password: _, ...safeUser } = user;

  return res.status(200).json({
    status: 'success',
    message: 'successfully retrieved current user.',
    data: {
      user: safeUser,
    },
  });
};

export const register = async (
  req: AuthenticatedRequest<{}, {}, RegisterDto>,
  res: Response,
): Promise<Response | void> => {
  const { firstName, lastName, email, password } = req.body;

  const userExists = await authRepository.findUserByEmail(email);

  if (userExists) {
    return res.status(400).json({
      status: 'error',
      message: 'user already exists with this email',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  generateToken(user.id, res);

  const { password: _, ...safeUser } = user;

  return res.status(201).json({
    status: 'success',
    message: 'register successfully.',
    data: {
      user: safeUser,
    },
  });
};
