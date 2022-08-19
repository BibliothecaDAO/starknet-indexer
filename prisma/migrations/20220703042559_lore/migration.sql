/*
  Warnings:

  - The primary key for the `LorePoisOnEntityRevisions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LorePropsOnEntityRevisions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "LoreEntity" ADD COLUMN     "ownerDisplayName" TEXT;

-- AlterTable
ALTER TABLE "LorePoisOnEntityRevisions" DROP CONSTRAINT "LorePoisOnEntityRevisions_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "LorePoisOnEntityRevisions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LorePropsOnEntityRevisions" DROP CONSTRAINT "LorePropsOnEntityRevisions_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "LorePropsOnEntityRevisions_pkey" PRIMARY KEY ("id");
