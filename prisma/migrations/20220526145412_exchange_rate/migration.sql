/*
  Warnings:

  - You are about to drop the `ExchangePrice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ExchangePrice";

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "date" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "amount" TEXT NOT NULL DEFAULT E'',
    "buyAmount" TEXT NOT NULL DEFAULT E'',
    "sellAmount" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("date","hour","tokenId")
);
