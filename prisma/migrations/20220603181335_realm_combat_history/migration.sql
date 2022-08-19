/*
  Warnings:

  - You are about to drop the `RealmEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RealmEvent";

-- CreateTable
CREATE TABLE "RealmHistory" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "realmId" INTEGER NOT NULL,
    "realmOwner" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "transactionHash" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "RealmHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CombatHistory" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "attackRealmId" INTEGER NOT NULL,
    "attackRealmOwner" TEXT NOT NULL,
    "attackSquad" JSONB NOT NULL,
    "defendRealmId" INTEGER NOT NULL,
    "defendRealmOwner" TEXT NOT NULL,
    "defendSquad" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "transactionHash" TEXT NOT NULL DEFAULT E'',
    "outcome" INTEGER NOT NULL DEFAULT 0,
    "attackType" INTEGER NOT NULL DEFAULT 0,
    "hitPoints" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CombatHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RealmHistory_realmOwner_eventId_idx" ON "RealmHistory"("realmOwner", "eventId" DESC);

-- CreateIndex
CREATE INDEX "RealmHistory_realmId_eventId_idx" ON "RealmHistory"("realmId", "eventId" DESC);

-- CreateIndex
CREATE INDEX "RealmHistory_eventType_eventId_idx" ON "RealmHistory"("eventType", "eventId" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "RealmHistory_eventId_eventType_key" ON "RealmHistory"("eventId", "eventType");

-- CreateIndex
CREATE INDEX "CombatHistory_transactionHash_defendRealmId_eventId_idx" ON "CombatHistory"("transactionHash", "defendRealmId", "eventId" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "CombatHistory_defendRealmId_eventId_key" ON "CombatHistory"("defendRealmId", "eventId");
