import { z } from 'zod';

import {
  changeUserPasswordSchema,
  updateUserSchema,
  updateUserSavedColorsSchema,
} from '../validators/user.validator';

export type ChangeUserPasswordDto = z.infer<typeof changeUserPasswordSchema>;

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export type UpdateUserSavedColorsDto = z.infer<
  typeof updateUserSavedColorsSchema
>;
