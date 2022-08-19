/*
  Warnings:

  - A unique constraint covering the columns `[realmId,buildingId]` on the table `Building` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Building_realmId_eventId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Building_realmId_buildingId_key" ON "Building"("realmId", "buildingId");
