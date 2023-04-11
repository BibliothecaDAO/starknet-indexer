-- CreateTable
CREATE TABLE "BastionHistory" (
    "bastionId" INTEGER NOT NULL,
    "realmHistoryEventId" TEXT NOT NULL,
    "realmHistoryEventType" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BastionHistory_realmHistoryEventId_realmHistoryEventType_key" ON "BastionHistory"("realmHistoryEventId", "realmHistoryEventType");

-- AddForeignKey
ALTER TABLE "BastionHistory" ADD CONSTRAINT "BastionHistory_realmHistoryEventId_realmHistoryEventType_fkey" FOREIGN KEY ("realmHistoryEventId", "realmHistoryEventType") REFERENCES "RealmHistory"("eventId", "eventType") ON DELETE RESTRICT ON UPDATE CASCADE;
