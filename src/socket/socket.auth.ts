import { env } from '../config/env.js';

import jwt, { type JwtPayload } from 'jsonwebtoken';

import { usersRepository } from '../repositories/user.repository.js';

import type { Socket } from 'socket.io';

interface AuthTokenPayload extends JwtPayload {
  id: string;
}

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    const token = cookieHeader
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('jwt='))
      ?.slice(4);

    if (!token) {
      return next(new Error('No token'));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;

    const user = await usersRepository.findUserById(decoded.id);

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.data.user = user;

    next();
  } catch (error) {
    console.error(error);

    next(new Error(error instanceof Error ? error.message : 'Invalid token'));
  }
};
