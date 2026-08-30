import http from 'http';
import dotenv from 'dotenv';
import { registerProcessHandlers } from './config/process';
import { initializeSocket } from './socket/socket.server';
import { setSocketServer } from './socket/socket.gateway';

import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const io = initializeSocket(httpServer);

setSocketServer(io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

registerProcessHandlers(httpServer);
