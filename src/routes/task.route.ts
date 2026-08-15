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
  getTaskActivities,
  getTasks,
  updateTask,
} from '../controllers/task.controller';

const router = express.Router();

router.post('/', authMiddleware, validateRequest(createTaskSchema), createTask);

router.delete('/:taskId', authMiddleware, deleteTask);

router.get('/:taskId', authMiddleware, getTask);

router.get('/:taskId/activities', authMiddleware, getTaskActivities);

router.get('/', authMiddleware, getTasks);

router.patch(
  '/:taskId',
  authMiddleware,
  validateRequest(updateTaskSchema),
  updateTask,
);

export default router;
