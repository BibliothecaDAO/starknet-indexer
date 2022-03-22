-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Realm" (
    "id" SERIAL NOT NULL,
    "realmId" INTEGER NOT NULL,
    "name" TEXT,
    "owner" TEXT,
    "resourceIds" INTEGER[],

    CONSTRAINT "Realm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buildings" (
    "id" SERIAL NOT NULL,
    "realmId" INTEGER,

    CONSTRAINT "Buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Building" (
    "id" SERIAL NOT NULL,
    "qty" INTEGER,
    "resourceIds" INTEGER[],
    "resourceCosts" INTEGER[],

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "resourceName" TEXT NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourcesOnRealms" (
    "realmId" INTEGER NOT NULL,
    "resourceId" INTEGER NOT NULL,

    CONSTRAINT "ResourcesOnRealms_pkey" PRIMARY KEY ("realmId","resourceId")
);

-- CreateTable
CREATE TABLE "SRealm" (
    "id" SERIAL NOT NULL,
    "realmId" INTEGER NOT NULL,
    "owner" TEXT,

    CONSTRAINT "SRealm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Squad" (
    "id" SERIAL NOT NULL,
    "realmId" INTEGER NOT NULL,
    "realmOffenceId" INTEGER,
    "realmDefenceId" INTEGER,

    CONSTRAINT "Squad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Desiege" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "winner" INTEGER,
    "attackedTokens" INTEGER,
    "defendedTokens" INTEGER,
    "eventIndexed" INTEGER,
    "initialHealth" INTEGER DEFAULT 0,
    "startedOn" TIMESTAMP(3),

    CONSTRAINT "Desiege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "chainId" TEXT NOT NULL,
    "contract" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parameters" INTEGER[],
    "timestamp" TIMESTAMP(3) NOT NULL,
    "txHash" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_realmId_key" ON "Realm"("realmId");

-- CreateIndex
CREATE UNIQUE INDEX "Buildings_realmId_key" ON "Buildings"("realmId");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_resourceId_key" ON "Resource"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "SRealm_realmId_key" ON "SRealm"("realmId");

-- CreateIndex
CREATE UNIQUE INDEX "Squad_realmId_key" ON "Squad"("realmId");

-- CreateIndex
CREATE UNIQUE INDEX "Squad_realmOffenceId_key" ON "Squad"("realmOffenceId");

-- CreateIndex
CREATE UNIQUE INDEX "Squad_realmDefenceId_key" ON "Squad"("realmDefenceId");

-- CreateIndex
CREATE UNIQUE INDEX "Desiege_gameId_key" ON "Desiege"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventId_key" ON "Event"("eventId");

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_owner_fkey" FOREIGN KEY ("owner") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buildings" ADD CONSTRAINT "Buildings_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourcesOnRealms" ADD CONSTRAINT "ResourcesOnRealms_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourcesOnRealms" ADD CONSTRAINT "ResourcesOnRealms_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("resourceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SRealm" ADD CONSTRAINT "SRealm_owner_fkey" FOREIGN KEY ("owner") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_realmOffenceId_fkey" FOREIGN KEY ("realmOffenceId") REFERENCES "Realm"("realmId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_realmDefenceId_fkey" FOREIGN KEY ("realmDefenceId") REFERENCES "Realm"("realmId") ON DELETE SET NULL ON UPDATE CASCADE;
