import dotenv from 'dotenv';

import { registerProcessHandlers } from './config/process';

import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

registerProcessHandlers(server);
