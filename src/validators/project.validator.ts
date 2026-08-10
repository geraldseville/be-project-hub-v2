import { z } from 'zod';

import { createTaskSchema } from './task.validator';

export const createProjectSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.'),

    description: z.string().trim().optional(),

    status: z
      .enum(['PLANNING', 'ACTIVE', 'REVIEW', 'COMPLETED', 'ARCHIVE'], {
        error: 'Invalid project status.',
      })
      .default('PLANNING'),

    urgency: z
      .enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
        error: 'Invalid project urgency.',
      })
      .default('LOW'),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    primaryColor: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid primary color.')
      .default('#000000'),

    secondaryColor: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid secondary color.')
      .default('#000000'),

    memberIds: z.array(z.string().uuid()).default([]),

    tasks: z.array(createTaskSchema).optional().default([]),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      message: 'End date must be after start date.',
      path: ['endDate'],
    },
  );

export const updateProjectSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.').optional(),

    description: z.string().trim().optional(),

    status: z
      .enum(['PLANNING', 'ACTIVE', 'REVIEW', 'COMPLETED', 'ARCHIVE'], {
        error: 'Invalid project status.',
      })
      .optional(),

    urgency: z
      .enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
        error: 'Invalid project urgency.',
      })
      .optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    primaryColor: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid primary color.')
      .optional(),

    secondaryColor: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid secondary color.')
      .optional(),

    memberIds: z.array(z.string().uuid()).optional(),

    tasks: z.array(createTaskSchema).optional(),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      message: 'End date must be after start date.',
      path: ['endDate'],
    },
  );
