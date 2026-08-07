import express from 'express';

import authRoutes from './auth.route';
import userRoute from './users.route';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/users', userRoute);

router.use('/test', (req, res) => {
  res.json({
    message: 'test reached',
  });
});

export default router;
