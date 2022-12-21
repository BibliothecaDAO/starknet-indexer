-- CreateTable
CREATE TABLE "Labor" (
    "id" SERIAL NOT NULL,
    "realmId" INTEGER NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "vaultBalance" TIMESTAMP(3),
    "balance" TIMESTAMP(3),
    "lastUpdate" TIMESTAMP(3),
    "lastEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Labor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Labor_realmId_resourceId_key" ON "Labor"("realmId", "resourceId");

-- AddForeignKey
ALTER TABLE "Labor" ADD CONSTRAINT "Labor_realmId_resourceId_fkey" FOREIGN KEY ("realmId", "resourceId") REFERENCES "Resource"("realmId", "resourceId") ON DELETE RESTRICT ON UPDATE CASCADE;
