import { z } from 'zod';

import {
  createTaskSchema,
  updateTaskSchema,
} from '../validators/task.validator.js';

export type CreateTaskDto = z.infer<typeof createTaskSchema>;

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
