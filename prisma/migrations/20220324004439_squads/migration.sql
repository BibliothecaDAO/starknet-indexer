/*
  Warnings:

  - You are about to drop the column `lvl` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `qty` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `realmDefenceId` on the `Squad` table. All the data in the column will be lost.
  - You are about to drop the column `realmOffenceId` on the `Squad` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[realmId,action]` on the table `Squad` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `Squad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Squad` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SquadType" AS ENUM ('Watchman', 'Guard', 'Guard_Captain', 'Squire', 'Knight', 'Knight_Commander', 'Scout', 'Archer', 'Sniper', 'Scorpio', 'Ballista', 'Catapult', 'Shaman', 'Healer', 'Life_Mage', 'Apprentice', 'Mage', 'Arcanist', 'Grand_Marshal');

-- CreateEnum
CREATE TYPE "SquadAction" AS ENUM ('Offence', 'Defence');

-- DropIndex
DROP INDEX "Squad_realmDefenceId_key";

-- DropIndex
DROP INDEX "Squad_realmId_key";

-- DropIndex
DROP INDEX "Squad_realmOffenceId_key";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "lvl",
DROP COLUMN "qty";

-- AlterTable
ALTER TABLE "Squad" DROP COLUMN "realmDefenceId",
DROP COLUMN "realmOffenceId",
ADD COLUMN     "action" "SquadAction" NOT NULL,
ADD COLUMN     "type" "SquadType" NOT NULL;

-- CreateTable
CREATE TABLE "SquadCost" (
    "squadType" "SquadType" NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "SquadCost_pkey" PRIMARY KEY ("squadType")
);

-- CreateIndex
CREATE UNIQUE INDEX "SquadCost_squadType_resourceType_key" ON "SquadCost"("squadType", "resourceType");

-- CreateIndex
CREATE UNIQUE INDEX "Squad_realmId_action_key" ON "Squad"("realmId", "action");

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE RESTRICT ON UPDATE CASCADE;
