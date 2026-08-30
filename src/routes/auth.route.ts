import express from 'express';

import { login, logout, me, register } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', validateRequest(loginSchema), login);

router.post('/logout', logout);

router.get('/me', authMiddleware, me);

router.post('/register', validateRequest(registerSchema), register);

export default router;
