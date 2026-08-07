import { z } from 'zod';

import {
  changeUserPasswordSchema,
  updateUserSchema,
} from '../validators/user.validator';

export type ChangeUserPasswordDto = z.infer<typeof changeUserPasswordSchema>;

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
