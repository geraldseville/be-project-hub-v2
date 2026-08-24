import express from 'express';

import authRoutes from './auth.route';
import userRoute from './user.route';
import imageRoute from './image.route';
import projectRoute from './project.route';
import taskRoute from './task.route';
import notificationRoute from './notification.route';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/users', userRoute);

router.use('/images', imageRoute);

router.use('/projects', projectRoute);

router.use('/tasks', taskRoute);

router.use('/notifications', notificationRoute);

router.use('/test', (req, res) => {
  res.json({
    message: 'test reached',
  });
});

export default router;
