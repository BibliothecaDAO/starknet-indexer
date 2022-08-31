-- AlterTable
ALTER TABLE "ResourceTransfer" ADD COLUMN     "amountValue" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Troop" ADD COLUMN     "timestamp" TIMESTAMP(3);
