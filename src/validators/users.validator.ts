import { z } from 'zod';

import { isValidTimezone } from '../utils/dateTime.utils';

export const userChangePasswordSchema = z.object({
  newPassword: z.string().min(1, 'Password is required'),
});

export const userSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters.')
    .max(50, 'First name must not exceed 50 characters.')
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters.')
    .max(50, 'Last name must not exceed 50 characters.')
    .optional(),

  bio: z
    .string()
    .trim()
    .max(500, 'Bio must not exceed 500 characters.')
    .optional(),

  role: z.string().trim().optional(),

  imageUrl: z.string().trim().optional(),

  timezone: z
    .string()
    .trim()
    .refine(isValidTimezone, {
      message: 'Invalid timezone.',
    })
    .optional(),
});
