import express from 'express';

import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../validators/project.validator.js';
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from '../controllers/project.controller';
import { getTasksByProjectId } from '../controllers/task.controller.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  validateRequest(createProjectSchema),
  createProject,
);

router.delete('/:projectId', authMiddleware, deleteProject);

router.get('/:projectId', authMiddleware, getProject);

router.get('/:projectId/tasks', authMiddleware, getTasksByProjectId);

router.get('/', authMiddleware, getProjects);

router.patch(
  '/:projectId',
  authMiddleware,
  validateRequest(updateProjectSchema),
  updateProject,
);

export default router;
