/*
  Warnings:

  - You are about to drop the column `defense` on the `Troop` table. All the data in the column will be lost.
  - Added the required column `buildingIntegrity` to the `Building` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "buildingIntegrity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Troop" DROP COLUMN "defense",
ADD COLUMN     "armor" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "building" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Relic" (
    "realmId" INTEGER NOT NULL,
    "heldByRealm" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Relic_realmId_key" ON "Relic"("realmId");

-- AddForeignKey
ALTER TABLE "Relic" ADD CONSTRAINT "Relic_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relic" ADD CONSTRAINT "Relic_heldByRealm_fkey" FOREIGN KEY ("heldByRealm") REFERENCES "Realm"("realmId") ON DELETE RESTRICT ON UPDATE CASCADE;
