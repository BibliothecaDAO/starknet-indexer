-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('Power', 'Giants', 'Titans', 'Skill', 'Perfection', 'Brilliance', 'Enlightenment', 'Protection', 'Anger', 'Rage', 'Fury', 'Vitriol', 'the_Fox', 'Detection', 'Reflection', 'the_Twins');

-- AlterTable
ALTER TABLE "Realm" ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "orderType" "OrderType",
ADD COLUMN     "rarityRank" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rarityScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Resource" ALTER COLUMN "qty" SET DEFAULT 0;
