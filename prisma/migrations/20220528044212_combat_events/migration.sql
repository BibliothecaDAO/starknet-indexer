/*
  Warnings:

  - You are about to drop the column `attackTroopIds` on the `Realm` table. All the data in the column will be lost.
  - You are about to drop the column `defendTroopIds` on the `Realm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Realm" DROP COLUMN "attackTroopIds",
DROP COLUMN "defendTroopIds";

-- CreateTable
CREATE TABLE "Troop" (
    "realmId" INTEGER NOT NULL,
    "troopId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL DEFAULT 0,
    "agility" INTEGER NOT NULL DEFAULT 0,
    "attack" INTEGER NOT NULL DEFAULT 0,
    "defense" INTEGER NOT NULL DEFAULT 0,
    "vitality" INTEGER NOT NULL DEFAULT 0,
    "wisdom" INTEGER NOT NULL DEFAULT 0,
    "squadSlot" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Troop_realmId_index_squadSlot_key" ON "Troop"("realmId", "index", "squadSlot");

-- AddForeignKey
ALTER TABLE "Troop" ADD CONSTRAINT "Troop_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
