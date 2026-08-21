/*
  Warnings:

  - A unique constraint covering the columns `[taskNumber]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "taskNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_taskNumber_key" ON "Task"("taskNumber");
