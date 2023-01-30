-- CreateEnum
CREATE TYPE "ExchangeEventType" AS ENUM ('LiquidityAdded', 'LiquidityRemoved', 'TokensPurchased', 'CurrencyPurchased');

-- CreateTable
CREATE TABLE "ExchangeEvent" (
    "eventId" TEXT NOT NULL,
    "type" "ExchangeEventType" NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "currencyAmount" TEXT NOT NULL,
    "currencyAmountValue" DECIMAL(80,20) NOT NULL DEFAULT 0,
    "resourceAmount" TEXT NOT NULL,
    "resourceAmountValue" DECIMAL(80,20) NOT NULL DEFAULT 0,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExchangeEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeEvent_eventId_key" ON "ExchangeEvent"("eventId");

-- CreateIndex
CREATE INDEX "ExchangeEvent_eventId_idx" ON "ExchangeEvent"("eventId" DESC);

-- CreateIndex
CREATE INDEX "ExchangeEvent_resourceId_type_timestamp_idx" ON "ExchangeEvent"("resourceId", "type", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "ResourceTransfer_toAddress_resourceId_timestamp_idx" ON "ResourceTransfer"("toAddress", "resourceId", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "ResourceTransfer_fromAddress_resourceId_timestamp_idx" ON "ResourceTransfer"("fromAddress", "resourceId", "timestamp" DESC);
