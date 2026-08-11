import express from 'express';

import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  changeUserPasswordSchema,
  updateUserSavedColorsSchema,
  updateUserSchema,
} from '../validators/user.validator';
import {
  changeMyPassword,
  deleteMyAccount,
  getUsers,
  getUser,
  updateMe,
  updateMySavedColors,
} from '../controllers/user.controller';

const router = express.Router();

router.patch(
  '/me/change-password',
  authMiddleware,
  validateRequest(changeUserPasswordSchema),
  changeMyPassword,
);

router.delete('/me', authMiddleware, deleteMyAccount);

router.get('/', authMiddleware, getUsers);

router.get('/:id', authMiddleware, getUser);

router.patch(
  '/me',
  authMiddleware,
  validateRequest(updateUserSchema),
  updateMe,
);

router.patch(
  '/me/saved-colors',
  authMiddleware,
  validateRequest(updateUserSavedColorsSchema),
  updateMySavedColors,
);

export default router;
