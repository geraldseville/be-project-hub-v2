import express from 'express';

import authRoutes from './auth.route';
import userRoute from './users.route';
import imageRoute from './images.route';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/users', userRoute);

router.use('/images', imageRoute);

router.use('/test', (req, res) => {
  res.json({
    message: 'test reached',
  });
});

export default router;
