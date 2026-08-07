import type { User as PrismaUser } from '@prisma/client';
import type { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: PrismaUser | null;
      file?: Multer.File;
    }
  }
}

export {};
