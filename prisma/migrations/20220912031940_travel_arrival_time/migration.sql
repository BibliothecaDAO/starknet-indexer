/*
  Warnings:

  - Changed the type of `arrivalTime` on the `Travel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Travel" DROP COLUMN "arrivalTime",
ADD COLUMN     "arrivalTime" TIMESTAMP(3) NOT NULL;
