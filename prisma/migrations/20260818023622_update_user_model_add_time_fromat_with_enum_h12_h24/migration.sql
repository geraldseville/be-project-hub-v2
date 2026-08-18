-- CreateEnum
CREATE TYPE "TimeFormat" AS ENUM ('H12', 'H24');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "timeFormat" "TimeFormat" NOT NULL DEFAULT 'H12';
