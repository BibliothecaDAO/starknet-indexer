/*
  Warnings:

  - You are about to drop the column `visitingRealmId` on the `Army` table. All the data in the column will be lost.
  - You are about to drop the column `arrivalTime` on the `Travel` table. All the data in the column will be lost.
  - Added the required column `destinationArrivalTime` to the `Army` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationArrivalTime` to the `Travel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Army" DROP COLUMN "visitingRealmId",
ADD COLUMN     "destinationArrivalTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "destinationRealmId" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Travel" DROP COLUMN "arrivalTime",
ADD COLUMN     "destinationArrivalTime" TIMESTAMP(3) NOT NULL;
