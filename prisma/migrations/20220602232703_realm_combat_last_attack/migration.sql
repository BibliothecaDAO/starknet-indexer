-- AlterTable
ALTER TABLE "Realm" ADD COLUMN     "lastAttacked" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RealmEvent" ADD COLUMN     "transactionHash" TEXT NOT NULL DEFAULT E'';
