import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { socketAuthMiddleware } from './socket.auth';

export function initializeSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
