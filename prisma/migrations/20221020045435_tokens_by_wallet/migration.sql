/*
  Warnings:

  - You are about to drop the `ResourceToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SRealm` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ResourceToken" DROP CONSTRAINT "ResourceToken_address_fkey";

-- DropForeignKey
ALTER TABLE "SRealm" DROP CONSTRAINT "SRealm_owner_fkey";

-- DropTable
DROP TABLE "ResourceToken";

-- DropTable
DROP TABLE "SRealm";

-- CreateTable
CREATE TABLE "TokensByWallet" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "amount" TEXT NOT NULL DEFAULT E'0',

    CONSTRAINT "TokensByWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokensByWallet_address_tokenId_key" ON "TokensByWallet"("address", "tokenId");

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_ownerL2_fkey" FOREIGN KEY ("ownerL2") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_settledOwner_fkey" FOREIGN KEY ("settledOwner") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokensByWallet" ADD CONSTRAINT "TokensByWallet_address_fkey" FOREIGN KEY ("address") REFERENCES "Wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
