-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "toAddress" TEXT NOT NULL DEFAULT E'';

-- CreateTable
CREATE TABLE "RealmEvent" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "realmId" INTEGER NOT NULL,
    "realmOwner" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RealmEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RealmEvent_realmOwner_eventId_idx" ON "RealmEvent"("realmOwner", "eventId" DESC);

-- CreateIndex
CREATE INDEX "RealmEvent_realmId_eventId_idx" ON "RealmEvent"("realmId", "eventId" DESC);

-- CreateIndex
CREATE INDEX "RealmEvent_eventType_eventId_idx" ON "RealmEvent"("eventType", "eventId" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "RealmEvent_eventId_eventType_key" ON "RealmEvent"("eventId", "eventType");
