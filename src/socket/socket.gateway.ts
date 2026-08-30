import type { Server } from 'socket.io';

let io: Server;

export const setSocketServer = (socketServer: Server) => {
  io = socketServer;
};

export const emitToUser = (userId: string, event: string, data: unknown) => {
  io.to(`user:${userId}`).emit(event, data);
};
