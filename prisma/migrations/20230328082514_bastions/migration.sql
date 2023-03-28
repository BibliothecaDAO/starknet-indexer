-- AlterTable
ALTER TABLE "Army" ADD COLUMN     "bastionArrivalBlock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bastionCurrentLocation" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bastionId" TEXT,
ADD COLUMN     "bastionPastLocation" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "orderId" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Bastion" (
    "bastionId" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "Bastion_pkey" PRIMARY KEY ("bastionId")
);

-- CreateTable
CREATE TABLE "BastionLocation" (
    "bastionId" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "defendingOrderId" INTEGER NOT NULL DEFAULT 0,
    "takenBlock" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "BastionLocation_bastionId_locationId_key" ON "BastionLocation"("bastionId", "locationId");
