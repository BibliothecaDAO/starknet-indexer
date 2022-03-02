/*
  Warnings:

  - Made the column `gameId` on table `Desiege` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Desiege" ALTER COLUMN "gameId" SET NOT NULL;
