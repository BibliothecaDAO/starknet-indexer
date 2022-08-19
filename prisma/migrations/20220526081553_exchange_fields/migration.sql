/*
  Warnings:

  - You are about to drop the column `buyPrice` on the `ExchangePrice` table. All the data in the column will be lost.
  - You are about to drop the column `ratePrice` on the `ExchangePrice` table. All the data in the column will be lost.
  - You are about to drop the column `sellPrice` on the `ExchangePrice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExchangePrice" DROP COLUMN "buyPrice",
DROP COLUMN "ratePrice",
DROP COLUMN "sellPrice",
ADD COLUMN     "buyAmount" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "rateAmount" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "sellAmount" TEXT NOT NULL DEFAULT E'';
