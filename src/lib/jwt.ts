import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

import type { CookieOptions, Response } from 'express';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
};

export const generateToken = (userId: string, res: Response): string => {
  const token = jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

  res.cookie('jwt', token, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return token;
};
