import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  getNotifications,
  markNotificationAsRead,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
} from '../controllers/notification.controller';

const router = express.Router();

router.get('/', authMiddleware, getNotifications);

router.patch('/:notificationId/read', authMiddleware, markNotificationAsRead);

router.patch('/read', authMiddleware, markNotificationsAsRead);

router.patch('/read-all', authMiddleware, markAllNotificationsAsRead);

export default router;
