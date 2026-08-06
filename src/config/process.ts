import type { Server } from 'node:http';

import { prisma } from '../lib/prisma';

export function registerProcessHandlers(server: Server) {
  async function shutdown(code: number) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(code);
    });
  }

  process.on('SIGINT', () => {
    console.log('SIGINT received.');
    shutdown(0);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received.');
    shutdown(0);
  });

  process.on('uncaughtException', (error: Error) => {
    console.error(error);
    shutdown(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    console.error(reason);
    shutdown(1);
  });
}
