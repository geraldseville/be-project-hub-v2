import { z } from 'zod';

import { isValidTimezone } from '../utils/dateTime.utils.js';

export const changeUserPasswordSchema = z.object({
  newPassword: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
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
    .nullable()
    .optional(),

  role: z.string().trim().nullable().optional(),

  imageUrl: z.string().trim().nullable().optional(),

  socials: z.record(z.string(), z.string()).optional(),

  timezone: z
    .string()
    .trim()
    .refine(isValidTimezone, {
      message: 'Invalid timezone.',
    })
    .nullable()
    .optional(),

  timeFormat: z
    .enum(['H12', 'H24'], {
      error: 'Invalid time format.',
    })
    .optional(),

  savedColors: z
    .array(
      z
        .string()
        .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, 'Invalid HEX color.'),
    )
    .optional(),
});

export const updateUserSavedColorsSchema = z.object({
  savedColors: z
    .array(
      z
        .string()
        .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, 'Invalid HEX color.'),
    )
    .max(50, 'You can save up to 50 colors.'),
});
