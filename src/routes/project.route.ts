import express from 'express';

import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../validators/project.validator';
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from '../controllers/project.controller';
import { getTasksByProjectId } from '../controllers/task.controller';

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
