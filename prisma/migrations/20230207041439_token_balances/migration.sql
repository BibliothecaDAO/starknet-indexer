-- CreateTable
CREATE TABLE "LordTransfer" (
    "eventId" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL DEFAULT 0,
    "transactionNumber" INTEGER NOT NULL DEFAULT 0,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "amountValue" DECIMAL(80,20) NOT NULL DEFAULT 0,
    "transactionHash" TEXT NOT NULL DEFAULT '',
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LordTransfer_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE INDEX "LordTransfer_fromAddress_toAddress_eventId_idx" ON "LordTransfer"("fromAddress", "toAddress", "eventId" DESC);

-- CreateIndex
CREATE INDEX "LordTransfer_blockNumber_transactionNumber_eventId_idx" ON "LordTransfer"("blockNumber", "transactionNumber", "eventId" DESC);
