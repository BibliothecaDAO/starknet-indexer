/*
  Warnings:

  - You are about to drop the `TokensByWallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TokensByWallet";

-- CreateTable
CREATE TABLE "WalletToken" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "amount" TEXT NOT NULL DEFAULT E'0',
    "lastEventId" TEXT,

    CONSTRAINT "WalletToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletToken_address_tokenId_key" ON "WalletToken"("address", "tokenId");
