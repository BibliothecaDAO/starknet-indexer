/*
  Warnings:

  - Added the required column `locationContractId` to the `Travel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationNestedId` to the `Travel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationTokenId` to the `Travel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Travel" ADD COLUMN     "locationContractId" INTEGER NOT NULL,
ADD COLUMN     "locationNestedId" INTEGER NOT NULL,
ADD COLUMN     "locationTokenId" INTEGER NOT NULL;
