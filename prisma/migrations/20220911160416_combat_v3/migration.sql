-- CreateTable
CREATE TABLE "Army" (
    "realmId" INTEGER NOT NULL,
    "armyId" INTEGER NOT NULL,
    "visitingRealmId" INTEGER NOT NULL DEFAULT 0,
    "armyPacked" INTEGER NOT NULL DEFAULT 0,
    "lastAttacked" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,
    "callSign" INTEGER NOT NULL DEFAULT 0,
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
    "heavyInfantryHealth" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Army_realmId_armyId_key" ON "Army"("realmId", "armyId");

-- AddForeignKey
ALTER TABLE "Army" ADD CONSTRAINT "Army_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Army" ADD CONSTRAINT "Army_visitingRealmId_fkey" FOREIGN KEY ("visitingRealmId") REFERENCES "Realm"("realmId") ON DELETE RESTRICT ON UPDATE CASCADE;
