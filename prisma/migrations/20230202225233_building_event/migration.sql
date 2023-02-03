-- CreateTable
CREATE TABLE "BuildArmyEvent" (
    "eventId" TEXT NOT NULL,
    "realmId" INTEGER NOT NULL,
    "armyId" INTEGER NOT NULL,
    "lightCavalryQty" INTEGER NOT NULL DEFAULT 0,
    "lightCavalryHealth" INTEGER NOT NULL DEFAULT 0,
    "heavyCavalryQty" INTEGER NOT NULL DEFAULT 0,
    "heavyCavalryHealth" INTEGER NOT NULL DEFAULT 0,
    "archerQty" INTEGER NOT NULL DEFAULT 0,
    "archerHealth" INTEGER NOT NULL DEFAULT 0,
    "longbowQty" INTEGER NOT NULL DEFAULT 0,
    "longbowHealth" INTEGER NOT NULL DEFAULT 0,
    "mageQty" INTEGER NOT NULL DEFAULT 0,
    "mageHealth" INTEGER NOT NULL DEFAULT 0,
    "arcanistQty" INTEGER NOT NULL DEFAULT 0,
    "arcanistHealth" INTEGER NOT NULL DEFAULT 0,
    "lightInfantryQty" INTEGER NOT NULL DEFAULT 0,
    "lightInfantryHealth" INTEGER NOT NULL DEFAULT 0,
    "heavyInfantryQty" INTEGER NOT NULL DEFAULT 0,
    "heavyInfantryHealth" INTEGER NOT NULL DEFAULT 0,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuildArmyEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "BuildBuildingEvent" (
    "eventId" TEXT NOT NULL,
    "buildingId" INTEGER NOT NULL,
    "realmId" INTEGER NOT NULL,
    "buildingIntegrity" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuildBuildingEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "BuildArmyEvent_eventId_key" ON "BuildArmyEvent"("eventId");

-- CreateIndex
CREATE INDEX "BuildArmyEvent_eventId_idx" ON "BuildArmyEvent"("eventId" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "BuildBuildingEvent_eventId_key" ON "BuildBuildingEvent"("eventId");

-- CreateIndex
CREATE INDEX "BuildBuildingEvent_eventId_idx" ON "BuildBuildingEvent"("eventId" DESC);
