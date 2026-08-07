import express from 'express';

import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  changeUserPasswordSchema,
  updateUserSchema,
} from '../validators/users.validator';
import {
  changeMyPassword,
  deleteMyAccount,
  getUsers,
  updateMe,
} from '../controllers/users.controller';

const router = express.Router();

router.patch(
  '/me/change-password',
  authMiddleware,
  validateRequest(changeUserPasswordSchema),
  changeMyPassword,
);

router.delete('/me', authMiddleware, deleteMyAccount);

router.get('/', authMiddleware, getUsers);

router.patch(
  '/me',
  authMiddleware,
  validateRequest(updateUserSchema),
  updateMe,
);

export default router;
