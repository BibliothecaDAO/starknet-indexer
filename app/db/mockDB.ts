import 'reflect-metadata'
import { PrismaClient } from "@prisma/client";
import { context } from "../context";
import { WalletResolver, RealmResolver, BuildingsResolver } from "../resolvers";
import { wallet, realm, buildings } from "../db/testDB";

const Wallet = new WalletResolver();
const Realm = new RealmResolver();
const Buildings = new BuildingsResolver();

const prisma = new PrismaClient();

async function main() {
    try {


        await Wallet.createOrUpdateWallet(
            {
                address: wallet.address,
            },
            context
        );

        await Realm.createOrUpdateRealm(
            {
                name: realm.name,
                realmId: realm.realmId,
                owner: realm.owner,
            },
            context
        );

        await Buildings.createOrUpdateBuildings(
            {
                barracks: buildings.barracks,
                realmId: buildings.realmId,
            },
            context
        );

    } catch (e) {
        console.log(e);
    }
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
