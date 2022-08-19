-- DropForeignKey
ALTER TABLE "Troop" DROP CONSTRAINT "Troop_realmId_fkey";

-- AddForeignKey
ALTER TABLE "Troop" ADD CONSTRAINT "Troop_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("realmId") ON DELETE RESTRICT ON UPDATE CASCADE;
