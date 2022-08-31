/*
  Warnings:

  - You are about to alter the column `amountValue` on the `ResourceTransfer` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,20)`.

*/
-- AlterTable
ALTER TABLE "ResourceTransfer" ALTER COLUMN "amountValue" SET DATA TYPE DECIMAL(80,20);
