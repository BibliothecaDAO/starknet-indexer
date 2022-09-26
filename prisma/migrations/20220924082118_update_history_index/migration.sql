/*
  Warnings:

  - A unique constraint covering the columns `[eventId,eventType]` on the table `RealmHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RealmHistory_eventId_eventType_realmId_key";

-- CreateIndex
CREATE UNIQUE INDEX "RealmHistory_eventId_eventType_key" ON "RealmHistory"("eventId", "eventType");
