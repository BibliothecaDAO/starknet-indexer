-- AlterTable
ALTER TABLE "ExchangeRate" ADD COLUMN     "currencyReserve" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "tokenReserve" TEXT NOT NULL DEFAULT E'';
