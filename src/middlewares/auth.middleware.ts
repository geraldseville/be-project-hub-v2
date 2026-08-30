import { env } from '../config/env';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { usersRepository } from '../repositories/user.repository.js';

import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../types/auth.dto.js';

interface AuthTokenPayload extends JwtPayload {
  id: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401).json({
      error: 'No token',
    });

    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;

    const user = await usersRepository.findUserById(decoded.id);

    if (!user) {
      res.status(401).json({
        error: 'user not found',
      });

      return;
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      error: error instanceof Error ? error.message : 'Invalid token',
    });
  }
};
