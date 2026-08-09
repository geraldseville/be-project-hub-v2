import express from 'express';

import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validators/task.validator';
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from '../controllers/task.controller';

const router = express.Router();

router.post('/', authMiddleware, validateRequest(createTaskSchema), createTask);

router.delete('/:id', authMiddleware, deleteTask);

router.get('/:id', authMiddleware, getTask);

router.get('/', authMiddleware, getTasks);

router.get(
  '/:id',
  authMiddleware,
  validateRequest(updateTaskSchema),
  updateTask,
);

export default router;
