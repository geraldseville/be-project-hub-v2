import express from 'express';

import authRoutes from './auth.route.js';
import userRoute from './user.route.js';
import imageRoute from './image.route.js';
import projectRoute from './project.route.js';
import taskRoute from './task.route.js';
import notificationRoute from './notification.route.js';

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
