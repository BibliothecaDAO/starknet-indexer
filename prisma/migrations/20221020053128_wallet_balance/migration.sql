/*
  Warnings:

  - You are about to drop the `WalletToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "WalletToken";

-- CreateTable
CREATE TABLE "WalletBalance" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "amount" TEXT NOT NULL DEFAULT E'0',
    "lastEventId" TEXT,

    CONSTRAINT "WalletBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletBalance_address_tokenId_key" ON "WalletBalance"("address", "tokenId");
