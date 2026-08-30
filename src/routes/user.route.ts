import express from 'express';

import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  changeUserPasswordSchema,
  updateUserSavedColorsSchema,
  updateUserSchema,
} from '../validators/user.validator.js';
import {
  changeMyPassword,
  deleteMyAccount,
  getUsers,
  getUser,
  updateMe,
  updateMySavedColors,
} from '../controllers/user.controller.js';

const router = express.Router();

router.patch(
  '/me/change-password',
  authMiddleware,
  validateRequest(changeUserPasswordSchema),
  changeMyPassword,
);

router.delete('/me', authMiddleware, deleteMyAccount);

router.get('/', authMiddleware, getUsers);

router.get('/:userId', authMiddleware, getUser);

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
