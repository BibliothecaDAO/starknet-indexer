import 'reflect-metadata'
import { PrismaClient } from "@prisma/client";
import { context } from "../context";
import { WalletResolver, RealmResolver } from "../resolvers";
import { wallet, realm } from "../db/testDB";

const Wallet = new WalletResolver();
const Realm = new RealmResolver();
const prisma = new PrismaClient();

async function main() {
    try {
        await Wallet.createWallet(
            {
                address: wallet.address,
            },
            context
        );

        await Realm.createRealm(
            {
                name: realm.name,
                realmId: realm.realmId,
                owner: realm.owner,
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
