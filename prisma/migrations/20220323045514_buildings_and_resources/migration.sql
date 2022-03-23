/*
  Warnings:

  - You are about to drop the column `qty` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `resourceCosts` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `resourceIds` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `resourceIds` on the `Realm` table. All the data in the column will be lost.
  - You are about to drop the column `resourceId` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `resourceName` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the `Buildings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResourcesOnRealms` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[realmId]` on the table `Building` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type,realmId]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('Wood', 'Stone', 'Coal', 'Copper', 'Obsidian', 'Silver', 'Ironwood', 'Cold_Iron', 'Gold', 'Hartwood', 'Diamonds', 'Sapphire', 'Deep_Crystal', 'Ruby', 'Ignium', 'Ethereal_Silica', 'True_Ice', 'Twilight_Quartz', 'Alchemical_Silver', 'Adamantine', 'Mithral', 'Dragonhide');

-- CreateEnum
CREATE TYPE "RealmTraitType" AS ENUM ('Region', 'City', 'Harbor', 'River');

-- CreateEnum
CREATE TYPE "BuildingType" AS ENUM ('Fairgrounds', 'Royal_Reserve', 'Grand_Market', 'Castle', 'Guild', 'Officer_Academy', 'Granary', 'Housing', 'Amphitheater', 'Carpenter', 'School', 'Symposium', 'Logistics_Office', 'Explorers_Guild', 'Parade_Grounds', 'Resource_Facility', 'Dock', 'Fishmonger', 'Farms', 'Hamlet');

-- DropForeignKey
ALTER TABLE "Buildings" DROP CONSTRAINT "Buildings_realmId_fkey";

-- DropForeignKey
ALTER TABLE "ResourcesOnRealms" DROP CONSTRAINT "ResourcesOnRealms_realmId_fkey";

-- DropForeignKey
ALTER TABLE "ResourcesOnRealms" DROP CONSTRAINT "ResourcesOnRealms_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "Squad" DROP CONSTRAINT "Squad_realmDefenceId_fkey";

-- DropForeignKey
ALTER TABLE "Squad" DROP CONSTRAINT "Squad_realmOffenceId_fkey";

-- DropIndex
DROP INDEX "Resource_resourceId_key";

-- AlterTable
ALTER TABLE "Building" DROP COLUMN "qty",
DROP COLUMN "resourceCosts",
DROP COLUMN "resourceIds",
ADD COLUMN     "realmId" INTEGER,
ADD COLUMN     "type" "BuildingType" NOT NULL;

-- AlterTable
ALTER TABLE "Realm" DROP COLUMN "resourceIds";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "resourceId",
DROP COLUMN "resourceName",
ADD COLUMN     "lvl" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "qty" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "realmId" INTEGER,
ADD COLUMN     "type" "ResourceType" NOT NULL;

-- DropTable
DROP TABLE "Buildings";

-- DropTable
DROP TABLE "ResourcesOnRealms";

-- CreateTable
CREATE TABLE "BuildingRealmTraitConstraint" (
    "type" "BuildingType" NOT NULL,
    "traitType" "RealmTraitType" NOT NULL,
    "max" INTEGER NOT NULL DEFAULT 5
);

-- CreateTable
CREATE TABLE "BuildingCost" (
    "buildingType" "BuildingType" NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "BuildingCost_pkey" PRIMARY KEY ("buildingType")
);

-- CreateTable
CREATE TABLE "ResourceToken" (
    "id" SERIAL NOT NULL,
    "type" "ResourceType" NOT NULL,
    "qty" INTEGER NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "ResourceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealmTrait" (
    "type" "RealmTraitType" NOT NULL,
    "qty" INTEGER NOT NULL,
    "realmId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BuildingRealmTraitConstraint_type_key" ON "BuildingRealmTraitConstraint"("type");

-- CreateIndex
CREATE UNIQUE INDEX "BuildingCost_buildingType_resourceType_key" ON "BuildingCost"("buildingType", "resourceType");

-- CreateIndex
CREATE UNIQUE INDEX "RealmTrait_type_realmId_key" ON "RealmTrait"("type", "realmId");

-- CreateIndex
CREATE UNIQUE INDEX "Building_realmId_key" ON "Building"("realmId");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_type_realmId_key" ON "Resource"("type", "realmId");

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceToken" ADD CONSTRAINT "ResourceToken_address_fkey" FOREIGN KEY ("address") REFERENCES "Wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealmTrait" ADD CONSTRAINT "RealmTrait_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE RESTRICT ON UPDATE CASCADE;
