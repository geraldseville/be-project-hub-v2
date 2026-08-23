-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PROJECT_MEMBER_ADDED', 'PROJECT_UPDATED', 'PROJECT_DELETED', 'TASK_ASSIGNED', 'TASK_UPDATED', 'TASK_COMMENTED', 'TASK_DELETED');

-- CreateEnum
CREATE TYPE "NotificationEntityType" AS ENUM ('PROJECT', 'TASK', 'TASK_COMMENT');

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "actorId" TEXT,
    "type" "NotificationType" NOT NULL,
    "entityType" "NotificationEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "metadata" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notifications_recipientId_createdAt_idx" ON "Notifications"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "Notifications_recipientId_readAt_idx" ON "Notifications"("recipientId", "readAt");

-- CreateIndex
CREATE INDEX "Notifications_entityType_entityId_idx" ON "Notifications"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Notifications_actorId_idx" ON "Notifications"("actorId");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
