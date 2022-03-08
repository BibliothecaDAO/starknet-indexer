import { BuildingsInput } from "../resolvers/types"
import { RealmInput } from "../resolvers/types/realm-input"
import { WalletInput } from "../resolvers/types/wallet-input"

const walletAddress = "0xE417496166b097A05e1B0A4117C8Ad1d204aDb91"
const realmId = 3

export const realm: RealmInput = {
    name: "Stolsli",
    owner: walletAddress,
    realmId: realmId
}

export const wallet: WalletInput = {
    address: walletAddress,
    realms: [realm]
}

export const buildings: BuildingsInput = {
    barracks: 1,
    realmId: realmId
}
