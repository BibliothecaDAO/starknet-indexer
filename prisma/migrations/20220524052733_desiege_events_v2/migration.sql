-- AlterTable
ALTER TABLE "Desiege" ADD COLUMN     "damageInflicted" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "DesiegeAction" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "account" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "amountBoosted" INTEGER NOT NULL,
    "tokenOffset" INTEGER NOT NULL,

    CONSTRAINT "DesiegeAction_pkey" PRIMARY KEY ("id")
);
