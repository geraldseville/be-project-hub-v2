import express from 'express';
import multer from 'multer';

import { uploadProfileImage } from '../controllers/image.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  '/user-profile-image',
  authMiddleware,
  upload.single('image'),
  uploadProfileImage,
);

export default router;
