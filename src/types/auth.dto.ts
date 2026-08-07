import { z } from 'zod';

import { loginSchema, registerSchema } from '../validators/auth.validator';

export type LoginDto = z.infer<typeof loginSchema>;

export type RegisterDto = z.infer<typeof registerSchema>;
