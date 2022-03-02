-- AlterTable
ALTER TABLE "Realm" ADD COLUMN     "realmId" INTEGER,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "address" TEXT,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Desiege" (
    "id" SERIAL NOT NULL,
    "winner" INTEGER,
    "attackedTokens" INTEGER,
    "defendedTokens" INTEGER,
    "totalDamage" INTEGER,
    "totalShieldBoost" INTEGER,

    CONSTRAINT "Desiege_pkey" PRIMARY KEY ("id")
);
