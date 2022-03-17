import { BuildingsInput, ResourceInput, RealmInput, WalletInput } from "../resolvers/types"


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

export const resource: ResourceInput = {
    resourceId: 1,
    resourceName: "Wood",
    realmId: realmId
}