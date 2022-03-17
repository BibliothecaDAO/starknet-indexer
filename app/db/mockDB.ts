import 'reflect-metadata'
import { PrismaClient } from "@prisma/client";
import { context } from "../context";
import { WalletResolver, RealmResolver, BuildingsResolver, ResourceResolver } from "../resolvers";
import { wallet, realm, buildings, resource } from "../db/testDB";

const Wallet = new WalletResolver();
const Realm = new RealmResolver();
const Buildings = new BuildingsResolver();
const Resource = new ResourceResolver();

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

        await Resource.createOrUpdateResources(
            {
                resourceId: resource.resourceId,
                realmId: resource.realmId,
                resourceName: resource.resourceName
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
