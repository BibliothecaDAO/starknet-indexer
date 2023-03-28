/*
  Warnings:

  - The `bastionId` column on the `Army` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Bastion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `bastionId` on the `Bastion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `bastionId` on the `BastionLocation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Army" DROP COLUMN "bastionId",
ADD COLUMN     "bastionId" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Bastion" DROP CONSTRAINT "Bastion_pkey",
DROP COLUMN "bastionId",
ADD COLUMN     "bastionId" INTEGER NOT NULL,
ADD CONSTRAINT "Bastion_pkey" PRIMARY KEY ("bastionId");

-- AlterTable
ALTER TABLE "BastionLocation" DROP COLUMN "bastionId",
ADD COLUMN     "bastionId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BastionLocation_bastionId_locationId_key" ON "BastionLocation"("bastionId", "locationId");
