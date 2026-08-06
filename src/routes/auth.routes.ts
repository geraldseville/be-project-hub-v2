import express from 'express';

import { login, logout, register } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validators';

const router = express.Router();

router.post('/login', validateRequest(loginSchema), login);

router.post('/logout', logout);

router.post('/register', validateRequest(registerSchema), register);

export default router;
