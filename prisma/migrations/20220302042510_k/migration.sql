/*
  Warnings:

  - A unique constraint covering the columns `[gameId]` on the table `Desiege` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Desiege_gameId_key" ON "Desiege"("gameId");
