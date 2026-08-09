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

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  validateRequest(createProjectSchema),
  createProject,
);

router.delete('/:id', authMiddleware, deleteProject);

router.get('/:id', authMiddleware, getProject);

router.get('/', authMiddleware, getProjects);

router.patch(
  '/:id',
  authMiddleware,
  validateRequest(updateProjectSchema),
  updateProject,
);

export default router;
