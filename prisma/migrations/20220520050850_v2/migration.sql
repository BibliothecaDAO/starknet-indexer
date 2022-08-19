-- CreateEnum
CREATE TYPE "RealmTraitType" AS ENUM ('Region', 'City', 'Harbor', 'River');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('Power', 'Giants', 'Titans', 'Skill', 'Perfection', 'Brilliance', 'Enlightenment', 'Protection', 'Anger', 'Rage', 'Fury', 'Vitriol', 'the_Fox', 'Detection', 'Reflection', 'the_Twins');

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Realm" (
    "id" SERIAL NOT NULL,
    "realmId" INTEGER NOT NULL,
    "name" TEXT,
    "owner" TEXT,
    "bridgedOwner" TEXT,
    "ownerL2" TEXT,
    "settledOwner" TEXT,
    "wonder" TEXT,
    "rarityRank" INTEGER NOT NULL DEFAULT 0,
    "rarityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageUrl" TEXT NOT NULL DEFAULT E'',
    "orderType" "OrderType",
    "attackTroopIds" TEXT[],
    "defendTroopIds" TEXT[],

    CONSTRAINT "Realm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Building" (
    "id" SERIAL NOT NULL,
    "buildingId" INTEGER NOT NULL,
    "realmId" INTEGER,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildingRealmTraitConstraint" (
    "buildingId" INTEGER NOT NULL,
    "traitType" "RealmTraitType" NOT NULL,
    "max" INTEGER NOT NULL DEFAULT 5
);

-- CreateTable
CREATE TABLE "BuildingCost" (
    "buildingId" INTEGER NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BuildingCost_pkey" PRIMARY KEY ("buildingId")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "realmId" INTEGER,
    "level" INTEGER NOT NULL DEFAULT 0,
    "upgrades" TEXT[],

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceToken" (
    "id" SERIAL NOT NULL,
    "resourceId" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "SRealm" (
    "id" SERIAL NOT NULL,
    "realmId" INTEGER NOT NULL,
    "owner" TEXT,

    CONSTRAINT "SRealm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TroopCost" (
    "troopId" INTEGER NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "TroopCost_pkey" PRIMARY KEY ("troopId")
);

-- CreateTable
CREATE TABLE "Desiege" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "winner" INTEGER,
    "attackedTokens" INTEGER,
    "defendedTokens" INTEGER,
    "eventIndexed" TEXT,
    "initialHealth" INTEGER DEFAULT 0,
    "startedOn" TIMESTAMP(3),

    CONSTRAINT "Desiege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL DEFAULT 0,
    "transactionNumber" INTEGER NOT NULL DEFAULT 0,
    "chainId" TEXT NOT NULL,
    "contract" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parameters" TEXT[],
    "keys" TEXT[],
    "timestamp" TIMESTAMP(3) NOT NULL,
    "txHash" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LastIndexedEvent" (
    "moduleName" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "LastIndexedEvent_pkey" PRIMARY KEY ("moduleName")
);

-- CreateTable
CREATE TABLE "LoreEntity" (
    "id" INTEGER NOT NULL,
    "owner" TEXT,
    "kind" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LoreEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoreEntityRevision" (
    "id" SERIAL NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "arweaveId" TEXT NOT NULL,
    "title" TEXT,
    "markdown" TEXT,
    "excerpt" TEXT,
    "media_url" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "entityId" INTEGER NOT NULL,

    CONSTRAINT "LoreEntityRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LorePOI" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "assetType" TEXT,

    CONSTRAINT "LorePOI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoreProp" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LoreProp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LorePoisOnEntityRevisions" (
    "entityRevisionId" INTEGER NOT NULL,
    "poiId" INTEGER NOT NULL,
    "assetId" TEXT,

    CONSTRAINT "LorePoisOnEntityRevisions_pkey" PRIMARY KEY ("entityRevisionId","poiId")
);

-- CreateTable
CREATE TABLE "LorePropsOnEntityRevisions" (
    "entityRevisionId" INTEGER NOT NULL,
    "propId" INTEGER NOT NULL,
    "value" TEXT,

    CONSTRAINT "LorePropsOnEntityRevisions_pkey" PRIMARY KEY ("entityRevisionId","propId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_realmId_key" ON "Realm"("realmId");

-- CreateIndex
CREATE UNIQUE INDEX "Building_realmId_eventId_key" ON "Building"("realmId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildingRealmTraitConstraint_buildingId_key" ON "BuildingRealmTraitConstraint"("buildingId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildingCost_buildingId_resourceId_key" ON "BuildingCost"("buildingId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_resourceId_realmId_key" ON "Resource"("resourceId", "realmId");

-- CreateIndex
CREATE UNIQUE INDEX "RealmTrait_type_realmId_key" ON "RealmTrait"("type", "realmId");

-- CreateIndex
CREATE UNIQUE INDEX "SRealm_realmId_key" ON "SRealm"("realmId");

-- CreateIndex
CREATE UNIQUE INDEX "TroopCost_troopId_resourceId_key" ON "TroopCost"("troopId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Desiege_gameId_key" ON "Desiege"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventId_key" ON "Event"("eventId");

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_owner_fkey" FOREIGN KEY ("owner") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceToken" ADD CONSTRAINT "ResourceToken_address_fkey" FOREIGN KEY ("address") REFERENCES "Wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealmTrait" ADD CONSTRAINT "RealmTrait_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SRealm" ADD CONSTRAINT "SRealm_owner_fkey" FOREIGN KEY ("owner") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreEntityRevision" ADD CONSTRAINT "LoreEntityRevision_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "LoreEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LorePoisOnEntityRevisions" ADD CONSTRAINT "LorePoisOnEntityRevisions_entityRevisionId_fkey" FOREIGN KEY ("entityRevisionId") REFERENCES "LoreEntityRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LorePoisOnEntityRevisions" ADD CONSTRAINT "LorePoisOnEntityRevisions_poiId_fkey" FOREIGN KEY ("poiId") REFERENCES "LorePOI"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LorePropsOnEntityRevisions" ADD CONSTRAINT "LorePropsOnEntityRevisions_entityRevisionId_fkey" FOREIGN KEY ("entityRevisionId") REFERENCES "LoreEntityRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LorePropsOnEntityRevisions" ADD CONSTRAINT "LorePropsOnEntityRevisions_propId_fkey" FOREIGN KEY ("propId") REFERENCES "LoreProp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
