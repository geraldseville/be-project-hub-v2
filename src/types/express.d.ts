/// <reference types="node" />

import type { User as PrismaUser } from '@prisma/client';
import type { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?:
        | {
            id: string;
            email: string;
          }
        | PrismaUser;
      file?: Multer.File;
    }
  }
}

export {};
