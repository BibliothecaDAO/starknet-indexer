/*
  Warnings:

  - The `lastAttacked` column on the `Army` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Army" DROP COLUMN "lastAttacked",
ADD COLUMN     "lastAttacked" TIMESTAMP(3);
