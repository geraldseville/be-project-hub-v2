import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from '../controllers/project.controller';

const router = express.Router();

router.post('/', authMiddleware, createProject);

router.delete('/:id', authMiddleware, deleteProject);

router.get('/:id', authMiddleware, getProject);

router.get('/', authMiddleware, getProjects);

router.patch('/:id', authMiddleware, updateProject);

export default router;
