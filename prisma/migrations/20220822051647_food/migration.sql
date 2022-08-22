-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "realmId" INTEGER NOT NULL,
    "buildingId" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "harvests" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Food_realmId_buildingId_key" ON "Food"("realmId", "buildingId");
