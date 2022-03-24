import { SquadCost } from "@prisma/client";
import {
  BuildingInput,
  BuildingCostInput,
  SquadInput
} from "../resolvers/types";

export const walletAddress = "0xcdfe3d7ebfa793675426f150e928cd395469ca53";
const realmId = 1009;

export const building: BuildingInput = {
  id: 1,
  realmId: realmId,
  type: "Carpenter"
};

export const offenceSquad: SquadInput = {
  realmId: realmId,
  action: "Offence",
  type: "Apprentice"
};

export const defenceSquad: SquadInput = {
  realmId: realmId,
  action: "Defence",
  type: "Healer"
};

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

export const squadCosts: SquadCost[] = [
  { squadType: "Watchman", resourceType: "Wood", qty: 100 },
  { squadType: "Watchman", resourceType: "Silver", qty: 80 },
  { squadType: "Guard", resourceType: "Wood", qty: 60 },
  { squadType: "Guard_Captain", resourceType: "Wood", qty: 30 },
  { squadType: "Squire", resourceType: "Wood", qty: 100 },
  { squadType: "Knight", resourceType: "Wood", qty: 60 },
  { squadType: "Knight_Commander", resourceType: "Wood", qty: 30 },
  { squadType: "Scout", resourceType: "Wood", qty: 100 },
  { squadType: "Archer", resourceType: "Wood", qty: 60 },
  { squadType: "Sniper", resourceType: "Wood", qty: 30 },
  { squadType: "Scorpio", resourceType: "Wood", qty: 100 },
  { squadType: "Ballista", resourceType: "Wood", qty: 50 },
  { squadType: "Catapult", resourceType: "Wood", qty: 110 },
  { squadType: "Shaman", resourceType: "Wood", qty: 40 },
  { squadType: "Healer", resourceType: "Copper", qty: 110 },
  { squadType: "Life_Mage", resourceType: "Wood", qty: 10 },
  { squadType: "Apprentice", resourceType: "Wood", qty: 20 },
  { squadType: "Mage", resourceType: "Wood", qty: 10 },
  { squadType: "Arcanist", resourceType: "Wood", qty: 70 },
  { squadType: "Grand_Marshal", resourceType: "Wood", qty: 120 }
];
