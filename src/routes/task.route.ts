import express from 'express';

import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validators/task.validator.js';
import {
  createTask,
  createTaskComment,
  deleteTask,
  getTask,
  getTaskActivities,
  getTasks,
  updateTask,
} from '../controllers/task.controller.js';

const router = express.Router();

router.post('/', authMiddleware, validateRequest(createTaskSchema), createTask);

router.post('/:taskId/comments', authMiddleware, createTaskComment);

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
