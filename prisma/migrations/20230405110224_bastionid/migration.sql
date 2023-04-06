/*
  Warnings:

  - You are about to drop the `BastionHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "RealmHistory" ADD COLUMN     "bastionId" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "BastionHistory";

-- CreateIndex
CREATE INDEX "RealmHistory_bastionId_eventId_idx" ON "RealmHistory"("bastionId", "eventId" DESC);
