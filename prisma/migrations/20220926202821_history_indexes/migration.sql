-- CreateIndex
CREATE INDEX "RealmHistory_realmOwner_eventId_idx" ON "RealmHistory"("realmOwner", "eventId" DESC);

-- CreateIndex
CREATE INDEX "RealmHistory_realmId_eventId_idx" ON "RealmHistory"("realmId", "eventId" DESC);

-- CreateIndex
CREATE INDEX "RealmHistory_eventType_eventId_idx" ON "RealmHistory"("eventType", "eventId" DESC);
