import { z } from 'zod';

import { isValidTimezone } from '../utils/dateTime.utils';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please provide a valid email')
    .toLowerCase(),

  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.email(),

  password: z.string().min(8),

  firstName: z.string(),

  lastName: z.string(),

  timezone: z
    .string()
    .trim()
    .refine(isValidTimezone, {
      message: 'Invalid timezone.',
    })
    .optional(),
});
