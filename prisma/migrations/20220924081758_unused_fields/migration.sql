/*
  Warnings:

  - You are about to drop the column `toAddress` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `realmName` on the `RealmHistory` table. All the data in the column will be lost.
  - You are about to drop the column `realmOrder` on the `RealmHistory` table. All the data in the column will be lost.
  - You are about to drop the column `realmOwner` on the `RealmHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId,eventType,realmId]` on the table `RealmHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RealmHistory_eventId_eventType_key";

-- DropIndex
DROP INDEX "RealmHistory_eventType_eventId_idx";

-- DropIndex
DROP INDEX "RealmHistory_realmId_eventId_idx";

-- DropIndex
DROP INDEX "RealmHistory_realmOwner_eventId_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "toAddress";

-- AlterTable
ALTER TABLE "RealmHistory" DROP COLUMN "realmName",
DROP COLUMN "realmOrder",
DROP COLUMN "realmOwner";

-- CreateIndex
CREATE UNIQUE INDEX "RealmHistory_eventId_eventType_realmId_key" ON "RealmHistory"("eventId", "eventType", "realmId");
