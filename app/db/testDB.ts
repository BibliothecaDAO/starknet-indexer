import {
  BuildingInput,
  // ResourceInput,
  // RealmInput,
  // WalletInput,
  BuildingCostInput,
  RealmTraitInput
} from "../resolvers/types";

export const walletAddress = "0xE417496166b097A05e1B0A4117C8Ad1d204aDb91";
const realmId = 3;

// export const realm: RealmInput = {
//   name: "Stolsli",
//   owner: walletAddress,
//   realmId: realmId
// };

// export const wallet: WalletInput = {
//   address: walletAddress,
//   realms: [realm]
// };

export const building: BuildingInput = {
  id: 1,
  realmId: realmId,
  type: "Carpenter"
};

// export const resource: ResourceInput = {
//   id: 1,
//   type: "Wood",
//   realmId: realmId
// };

export const buildingCosts: BuildingCostInput[] = [
  { buildingType: "Fairgrounds", resourceType: "Wood", qty: 100 },
  { buildingType: "Royal_Reserve", resourceType: "Wood", qty: 100 },
  { buildingType: "Grand_Market", resourceType: "Wood", qty: 100 },
  { buildingType: "Castle", resourceType: "Wood", qty: 100 },
  { buildingType: "Castle", resourceType: "Sapphire", qty: 100 },
  { buildingType: "Guild", resourceType: "Wood", qty: 100 },
  { buildingType: "Officer_Academy", resourceType: "Wood", qty: 100 },
  { buildingType: "Granary", resourceType: "Wood", qty: 100 },
  { buildingType: "Granary", resourceType: "Alchemical_Silver", qty: 100 },
  { buildingType: "Housing", resourceType: "Wood", qty: 100 },
  { buildingType: "Amphitheater", resourceType: "Wood", qty: 100 },
  { buildingType: "Carpenter", resourceType: "Wood", qty: 100 },
  { buildingType: "Carpenter", resourceType: "Coal", qty: 100 },
  { buildingType: "School", resourceType: "Wood", qty: 100 },
  { buildingType: "Symposium", resourceType: "Wood", qty: 100 },
  { buildingType: "Logistics_Office", resourceType: "Wood", qty: 100 },
  { buildingType: "Explorers_Guild", resourceType: "Wood", qty: 100 },
  { buildingType: "Parade_Grounds", resourceType: "Wood", qty: 100 },
  { buildingType: "Resource_Facility", resourceType: "Wood", qty: 100 },
  { buildingType: "Dock", resourceType: "Wood", qty: 100 },
  { buildingType: "Fishmonger", resourceType: "Wood", qty: 100 },
  { buildingType: "Farms", resourceType: "Wood", qty: 100 },
  { buildingType: "Hamlet", resourceType: "Wood", qty: 100 }
];

export const realmTraits: RealmTraitInput[] = [
  { realmId, qty: 2, type: "Region" },
  { realmId, qty: 5, type: "City" },
  { realmId, qty: 3, type: "Harbor" },
  { realmId, qty: 3, type: "River" }
];
