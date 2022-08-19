-- CreateTable
CREATE TABLE "ResourceTransfer" (
    "resourceId" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL DEFAULT 0,
    "transactionNumber" INTEGER NOT NULL DEFAULT 0,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL DEFAULT E'',
    "timestamp" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "ResourceTransfer_fromAddress_toAddress_eventId_idx" ON "ResourceTransfer"("fromAddress", "toAddress", "eventId" DESC);

-- CreateIndex
CREATE INDEX "ResourceTransfer_blockNumber_transactionNumber_eventId_idx" ON "ResourceTransfer"("blockNumber", "transactionNumber", "eventId" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ResourceTransfer_resourceId_eventId_key" ON "ResourceTransfer"("resourceId", "eventId");
