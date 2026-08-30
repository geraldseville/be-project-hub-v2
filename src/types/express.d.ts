import { User as PrismaUser } from '@prisma/client';
import { Multer } from 'multer';

declare module 'express-serve-static-core' {
  interface Request {
    user?:
      | {
          id: string;
          email: string;
          [key: string]: any;
        }
      | PrismaUser;
    file?: Multer.File;
  }
}
