import { context } from "../context";
import { WalletResolver, RealmResolver } from "../resolvers";
import { wallet, realm } from "../db/testDB";

const Wallet = new WalletResolver();
const Realm = new RealmResolver();

const mockDB = async () => {

    try {

        await Wallet.createWallet(
            {
                address: wallet.address
            },
            context
        );

        await Realm.createRealm(
            {
                name: realm.name,
                realmId: realm.realmId,
                owner: realm.owner
            },
            context
        );



    } catch (e) {
        console.log(e);
    }
};

export const StarkNet = () => {
    return {
        async serverWillStart() {
            await mockDB()
        },
    };
};
