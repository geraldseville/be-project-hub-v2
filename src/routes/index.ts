import express from 'express';

import authRoutes from './auth.routes';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/test', (req, res) => {
  res.json({
    message: 'test reached',
  });
});

export default router;
