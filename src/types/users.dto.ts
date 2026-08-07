import { z } from 'zod';

import {
  userChangePasswordSchema,
  userSchema,
} from '../validators/users.validator';

export type UserChangePasswordDto = z.infer<typeof userChangePasswordSchema>;

export type UserDto = z.infer<typeof userSchema>;
