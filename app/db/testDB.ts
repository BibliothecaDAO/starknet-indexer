import { RealmInput } from "../resolvers/types/realm-input"
import { WalletInput } from "../resolvers/types/wallet-input"

const walletAddress = "0xE417496166b097A05e1B0A4117C8Ad1d204aDb91"

export const realm: RealmInput = {
    name: "Stolsli",
    owner: walletAddress,
    realmId: 3
}

export const wallet: WalletInput = {
    address: walletAddress,
    realms: [realm]
}
