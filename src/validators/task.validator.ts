import { z } from 'zod';

export const createTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.'),

    description: z.string().trim().optional(),

    status: z
      .enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'ARCHIVE'], {
        error: 'Invalid task status.',
      })
      .default('TODO'),

    priority: z
      .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
        error: 'Invalid task priority.',
      })
      .default('MEDIUM'),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    projectId: z.string().uuid('Invalid project ID.'),

    assigneeId: z.string().uuid('Invalid assignee ID.').optional(),
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
      .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
        error: 'Invalid task priority.',
      })
      .optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    projectId: z.string().uuid('Invalid project ID.').optional(),

    assigneeId: z.string().uuid('Invalid assignee ID.').optional(),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      message: 'End date must be after start date.',
      path: ['endDate'],
    },
  );
