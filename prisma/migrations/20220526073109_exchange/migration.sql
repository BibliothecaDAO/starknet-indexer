-- CreateTable
CREATE TABLE "ExchangePrice" (
    "date" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "ratePrice" TEXT NOT NULL,
    "buyPrice" TEXT NOT NULL,
    "sellPrice" TEXT NOT NULL,

    CONSTRAINT "ExchangePrice_pkey" PRIMARY KEY ("date","hour","tokenId")
);
