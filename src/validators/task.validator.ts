import { z } from 'zod';

export const createTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.'),

    description: z.string().trim().nullable().optional(),

    status: z
      .enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'ARCHIVE'], {
        error: 'Invalid task status.',
      })
      .default('TODO'),

    priority: z
      .enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
        error: 'Invalid task priority.',
      })
      .default('MEDIUM'),

    startDate: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.coerce.date().optional(),
    ),

    endDate: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.coerce.date().optional(),
    ),

    primaryColor: z
      .string()
      .trim()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        error: 'Invalid primary color.',
      })
      .optional(),

    projectId: z.string().cuid('Invalid project ID.'),

    assigneeId: z.string().cuid('Invalid assignee ID.').nullable().optional(),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      message: 'End date must be after start date.',
      path: ['endDate'],
    },
  );

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.').optional(),

    description: z.string().trim().optional(),

    status: z
      .enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'ARCHIVE'], {
        error: 'Invalid task status.',
      })
      .optional(),

    priority: z
      .enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
        error: 'Invalid task priority.',
      })
      .optional(),

    primaryColor: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .trim()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          error: 'Invalid primary color.',
        })
        .nullable()
        .optional(),
    ),

    startDate: z.preprocess(
      (value) => (value === '' ? null : value),
      z.coerce.date().nullable().optional(),
    ),

    endDate: z.preprocess(
      (value) => (value === '' ? null : value),
      z.coerce.date().nullable().optional(),
    ),

    projectId: z.string().cuid('Invalid project ID.').optional(),

    assigneeId: z.string().cuid('Invalid assignee ID.').optional(),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      message: 'End date must be after date.',
      path: ['endDate'],
    },
  );
