import express from 'express';

import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  userChangePasswordSchema,
  userSchema,
} from '../validators/users.validator';
import {
  changeMyPassword,
  deleteMyAccount,
  updateMe,
} from '../controllers/users.controller';

const router = express.Router();

router.get('/', authMiddleware);

router.delete('/me', authMiddleware, deleteMyAccount);

router.get('/me', authMiddleware);

router.patch('/me', authMiddleware, validateRequest(userSchema), updateMe);

router.patch(
  '/me/change-password',
  authMiddleware,
  validateRequest(userChangePasswordSchema),
  changeMyPassword,
);

export default router;
