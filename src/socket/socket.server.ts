import { Server } from 'socket.io';

import { socketAuthMiddleware } from './socket.auth.js';
import { allowedOrigins } from '../config/cors.js';

import type { Server as HttpServer } from 'http';

export function initializeSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        // Allow requests with no Origin (e.g. Postman, curl)
        if (!origin) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    const user = socket.data.user;

    console.log('user', user);

    socket.join(`user:${user.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  io.use(socketAuthMiddleware);

  return io;
}
