-- AlterTable
ALTER TABLE "Realm" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- CreateTable
CREATE TABLE "Travel" (
    "eventId" TEXT NOT NULL,
    "contractId" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "nestedId" INTEGER NOT NULL,
    "destinationContractId" INTEGER NOT NULL,
    "destinationTokenId" INTEGER NOT NULL,
    "destinationNestedId" INTEGER NOT NULL,
    "arrivalTime" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Travel_pkey" PRIMARY KEY ("eventId")
);
