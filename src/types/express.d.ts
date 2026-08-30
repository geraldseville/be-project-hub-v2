import type { User as PrismaUser } from '@prisma/client';
import type { Multer } from 'multer';
import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: PrismaUser;
      file?: Multer.File;
    }
  }
}

export {};
