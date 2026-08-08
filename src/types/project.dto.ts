import { z } from 'zod';

import {
  createProjectSchema,
  updateProjectSchema,
} from '../validators/project.validator';

export type CreateProjectDto = z.infer<typeof createProjectSchema>;

export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
