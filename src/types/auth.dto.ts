import { z } from 'zod';

import { loginSchema, registerSchema } from '../validators/auth.validator.js';

import type { Request } from 'express';
import type { User } from '@prisma/client';

export type AuthenticatedRequest<
  TParams = Record<string, string>,
  TResBody = any,
  TReqBody = any,
  TQuery = Record<string, any>,
> = Request<TParams, TResBody, TReqBody, TQuery> & {
  user?: User;
};

export type LoginDto = z.infer<typeof loginSchema>;

export type RegisterDto = z.infer<typeof registerSchema>;
