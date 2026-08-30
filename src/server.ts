import http from 'http';
import dotenv from 'dotenv';

import { registerProcessHandlers } from './config/process.js';
import { initializeSocket } from './socket/socket.server.js';
import { setSocketServer } from './socket/socket.gateway.js';
import app from './app.js';

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
