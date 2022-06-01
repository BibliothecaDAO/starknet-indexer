export const TroopId = {
  Watchman: 1,
  Guard: 2,
  GuardCaptain: 3,
  Squire: 4,
  Knight: 5,
  KnightCommander: 6,
  Scout: 7,
  Archer: 8,
  Sniper: 9,
  Scorpio: 10,
  Ballista: 11,
  Catapult: 12,
  Apprentice: 13,
  Mage: 14,
  Arcanist: 15,
  GrandMarshal: 16
};

export type TroopName = keyof typeof TroopId;

export const TroopNameById = createIdToNameMap(TroopId);

export const ResourceId = {
  Wood: 1,
  Stone: 2,
  Coal: 3,
  Copper: 4,
  Obsidian: 5,
  Silver: 6,
  Ironwood: 7,
  ColdIron: 8,
  Gold: 9,
  Hartwood: 10,
  Diamonds: 11,
  Sapphire: 12,
  Ruby: 13,
  DeepCrystal: 14,
  Ignium: 15,
  EtherealSilica: 16,
  TrueIce: 17,
  TwilightQuartz: 18,
  AlchemicalSilver: 19,
  Adamantine: 20,
  Mithral: 21,
  Dragonhide: 22
};

export type ResourceName = keyof typeof ResourceId;

export const ResourceNameById = createIdToNameMap(ResourceId);

export const BuildingId = {
  Fairgrounds: 1,
  RoyalReserve: 2,
  GrandMarket: 3,
  Castle: 4,
  Guild: 5,
  OfficerAcademy: 6,
  Granary: 7,
  Housing: 8,
  Amphitheater: 9,
  ArcherTower: 10,
  School: 11,
  MageTower: 12,
  TradeOffice: 13,
  Architect: 14,
  ParadeGrounds: 15,
  Barracks: 16,
  Dock: 17,
  Fishmonger: 18,
  Farms: 19,
  Hamlet: 20
};

export type BuildingName = keyof typeof BuildingId;

export const BuildingNameById = createIdToNameMap(BuildingId);

export const TraitId = {
  Region: 1,
  City: 2,
  Harbour: 3,
  River: 4
};
export type TraitName = keyof typeof TraitId;

export const TraitNameById = createIdToNameMap(TraitId);

interface ResourceCost {
  resourceId: number;
  resourceName: string;
  amount: number;
}

interface Cost {
  amount: number;
  resources: ResourceCost[];
}

const createResourceCost = (resourceId: number, amount: number) => ({
  resourceId,
  resourceName: ResourceNameById[resourceId],
  amount
});

export const BuildingCost: { [key in BuildingName]: Cost } = {
  Castle: {
    amount: 50,
    resources: [
      createResourceCost(ResourceId.Wood, 30),
      createResourceCost(ResourceId.Stone, 50),
      createResourceCost(ResourceId.Copper, 100),
      createResourceCost(ResourceId.Adamantine, 4),
      createResourceCost(ResourceId.Mithral, 1),
      createResourceCost(ResourceId.Dragonhide, 1)
    ]
  },
  Fairgrounds: {
    amount: 50,
    resources: [
      createResourceCost(ResourceId.Wood, 40),
      createResourceCost(ResourceId.Stone, 50),
      createResourceCost(ResourceId.Silver, 40),
      createResourceCost(ResourceId.AlchemicalSilver, 8),
      createResourceCost(ResourceId.Mithral, 1),
      createResourceCost(ResourceId.Dragonhide, 1)
    ]
  },
  GrandMarket: {
    amount: 50,
    resources: [
      createResourceCost(ResourceId.Wood, 35),
      createResourceCost(ResourceId.Stone, 40),
      createResourceCost(ResourceId.Gold, 20),
      createResourceCost(ResourceId.TwilightQuartz, 10),
      createResourceCost(ResourceId.Mithral, 1),
      createResourceCost(ResourceId.Dragonhide, 1)
    ]
  },
  Guild: {
    amount: 50,
    resources: [
      createResourceCost(ResourceId.Wood, 50),
      createResourceCost(ResourceId.Stone, 50),
      createResourceCost(ResourceId.Coal, 120),
      createResourceCost(ResourceId.EtherealSilica, 12),
      createResourceCost(ResourceId.Mithral, 2),
      createResourceCost(ResourceId.Dragonhide, 1)
    ]
  },
  OfficerAcademy: {
    amount: 50,
    resources: [
      createResourceCost(ResourceId.Wood, 40),
      createResourceCost(ResourceId.Stone, 20),
      createResourceCost(ResourceId.ColdIron, 45),
      createResourceCost(ResourceId.Ignium, 12),
      createResourceCost(ResourceId.Mithral, 1),
      createResourceCost(ResourceId.Dragonhide, 1)
    ]
  },
  RoyalReserve: {
    amount: 50,
    resources: [
      createResourceCost(ResourceId.Wood, 50),
      createResourceCost(ResourceId.Stone, 20),
      createResourceCost(ResourceId.Ironwood, 50),
      createResourceCost(ResourceId.TrueIce, 10),
      createResourceCost(ResourceId.Mithral, 1),
      createResourceCost(ResourceId.Dragonhide, 1)
    ]
  },
  Amphitheater: {
    amount: 10,
    resources: [
      createResourceCost(ResourceId.Stone, 5),
      createResourceCost(ResourceId.Diamonds, 5),
      createResourceCost(ResourceId.Sapphire, 1),
      createResourceCost(ResourceId.TwilightQuartz, 2)
    ]
  },
  ArcherTower: {
    amount: 5,
    resources: [
      createResourceCost(ResourceId.Wood, 10),
      createResourceCost(ResourceId.Stone, 10),
      createResourceCost(ResourceId.Obsidian, 25),
      createResourceCost(ResourceId.Ironwood, 5)
    ]
  },
  Architect: {
    amount: 15,
    resources: [
      createResourceCost(ResourceId.Wood, 10),
      createResourceCost(ResourceId.Stone, 10),
      createResourceCost(ResourceId.Hartwood, 13),
      createResourceCost(ResourceId.DeepCrystal, 8)
    ]
  },
  Barracks: {
    amount: 5,
    resources: [
      createResourceCost(ResourceId.Wood, 13),
      createResourceCost(ResourceId.Stone, 10),
      createResourceCost(ResourceId.Obsidian, 20),
      createResourceCost(ResourceId.Silver, 10)
    ]
  },
  Dock: {
    amount: 5,
    resources: [
      createResourceCost(ResourceId.Stone, 2),
      createResourceCost(ResourceId.Coal, 15),
      createResourceCost(ResourceId.Ruby, 4)
    ]
  },
  Farms: {
    amount: 10,
    resources: [
      createResourceCost(ResourceId.Wood, 20),
      createResourceCost(ResourceId.Copper, 5),
      createResourceCost(ResourceId.Silver, 30),
      createResourceCost(ResourceId.Hartwood, 10)
    ]
  },
  Fishmonger: {
    amount: 10,
    resources: [
      createResourceCost(ResourceId.Wood, 30),
      createResourceCost(ResourceId.Obsidian, 55),
      createResourceCost(ResourceId.Silver, 6),
      createResourceCost(ResourceId.ColdIron, 5)
    ]
  },
  Granary: {
    amount: 15,
    resources: [
      createResourceCost(ResourceId.Wood, 10),
      createResourceCost(ResourceId.Obsidian, 10),
      createResourceCost(ResourceId.EtherealSilica, 4),
      createResourceCost(ResourceId.TrueIce, 4)
    ]
  },
  TradeOffice: {
    amount: 15,
    resources: [
      createResourceCost(ResourceId.Wood, 10),
      createResourceCost(ResourceId.Stone, 4),
      createResourceCost(ResourceId.Gold, 15),
      createResourceCost(ResourceId.Sapphire, 10)
    ]
  },
  Hamlet: {
    amount: 20,
    resources: [
      createResourceCost(ResourceId.Wood, 25),
      createResourceCost(ResourceId.ColdIron, 20),
      createResourceCost(ResourceId.Gold, 20),
      createResourceCost(ResourceId.Ruby, 10)
    ]
  },
  Housing: {
    amount: 35,
    resources: [
      createResourceCost(ResourceId.Stone, 50),
      createResourceCost(ResourceId.Coal, 120),
      createResourceCost(ResourceId.Copper, 120),
      createResourceCost(ResourceId.Ironwood, 70)
    ]
  },
  MageTower: {
    amount: 5,
    resources: [
      createResourceCost(ResourceId.Wood, 2),
      createResourceCost(ResourceId.Stone, 2),
      createResourceCost(ResourceId.Diamonds, 4),
      createResourceCost(ResourceId.Ignium, 1)
    ]
  },
  ParadeGrounds: {
    amount: 15,
    resources: [
      createResourceCost(ResourceId.Stone, 10),
      createResourceCost(ResourceId.Sapphire, 4),
      createResourceCost(ResourceId.Ignium, 4),
      createResourceCost(ResourceId.Adamantine, 1)
    ]
  },
  School: {
    amount: 1,
    resources: [
      createResourceCost(ResourceId.Stone, 10),
      createResourceCost(ResourceId.Diamonds, 4),
      createResourceCost(ResourceId.DeepCrystal, 3),
      createResourceCost(ResourceId.AlchemicalSilver, 3)
    ]
  }
};

export const BuildingLimitTrait: { [key in BuildingName]: number } = {
  Fairgrounds: TraitId.Region,
  RoyalReserve: TraitId.Region,
  GrandMarket: TraitId.Region,
  Castle: TraitId.Region,
  Guild: TraitId.Region,
  OfficerAcademy: TraitId.Region,
  Granary: TraitId.City,
  Housing: TraitId.City,
  Amphitheater: TraitId.City,
  ArcherTower: TraitId.City,
  School: TraitId.City,
  MageTower: TraitId.City,
  TradeOffice: TraitId.City,
  Architect: TraitId.City,
  ParadeGrounds: TraitId.City,
  Barracks: TraitId.City,
  Dock: TraitId.Harbour,
  Fishmonger: TraitId.Harbour,
  Farms: TraitId.River,
  Hamlet: TraitId.River
};

export const BuildingFood: { [key in BuildingName]: number } = {
  Fairgrounds: 5,
  RoyalReserve: 5,
  GrandMarket: 5,
  Castle: -1,
  Guild: -1,
  OfficerAcademy: -1,
  Granary: 3,
  Housing: -1,
  Amphitheater: -1,
  ArcherTower: -1,
  School: -1,
  MageTower: -1,
  TradeOffice: -1,
  Architect: -1,
  ParadeGrounds: -1,
  Barracks: -1,
  Dock: -1,
  Fishmonger: 2,
  Farms: 1,
  Hamlet: 1
};

export const BuildingCulture: { [key in BuildingName]: number } = {
  Fairgrounds: 5,
  RoyalReserve: 5,
  GrandMarket: 0,
  Castle: 5,
  Guild: 5,
  OfficerAcademy: 0,
  Granary: 0,
  Housing: 0,
  Amphitheater: 2,
  ArcherTower: 0,
  School: 3,
  MageTower: 0,
  TradeOffice: 1,
  Architect: 1,
  ParadeGrounds: 1,
  Barracks: 0,
  Dock: 0,
  Fishmonger: 0,
  Farms: 0,
  Hamlet: 0
};

export const BuildingPopulation: { [key in BuildingName]: number } = {
  Fairgrounds: -10,
  RoyalReserve: -10,
  GrandMarket: -10,
  Castle: -10,
  Guild: -10,
  OfficerAcademy: -10,
  Granary: -10,
  Housing: 75,
  Amphitheater: -10,
  ArcherTower: -10,
  School: -10,
  MageTower: -10,
  TradeOffice: -10,
  Architect: -10,
  ParadeGrounds: -10,
  Barracks: -10,
  Dock: -10,
  Fishmonger: -10,
  Farms: 10,
  Hamlet: 35
};

export const TroopType = {
  Melee: 1,
  Ranged: 2,
  Siege: 3
};

//Troop(type=TroopType.Melee, tier=1, agility=1, attack=1, defense=3, vitality=4, wisdom=1),
export const TroopStat: { [key in TroopName]: number[] } = {
  Watchman: [TroopType.Melee, 1, 1, 1, 3, 4, 1],
  Guard: [TroopType.Melee, 2, 2, 2, 6, 8, 2],
  GuardCaptain: [TroopType.Melee, 3, 4, 4, 12, 16, 4],
  Squire: [TroopType.Melee, 1, 1, 4, 1, 1, 3],
  Knight: [TroopType.Melee, 2, 2, 8, 2, 2, 6],
  KnightCommander: [TroopType.Melee, 3, 4, 16, 4, 4, 12],
  Scout: [TroopType.Ranged, 1, 4, 3, 1, 1, 1],
  Archer: [TroopType.Ranged, 2, 8, 6, 2, 2, 2],
  Sniper: [TroopType.Ranged, 3, 16, 12, 4, 4, 4],
  Scorpio: [TroopType.Siege, 1, 1, 4, 1, 3, 1],
  Ballista: [TroopType.Siege, 2, 2, 8, 2, 6, 2],
  Catapult: [TroopType.Siege, 3, 4, 16, 4, 12, 4],
  Apprentice: [TroopType.Ranged, 1, 2, 2, 1, 1, 4],
  Mage: [TroopType.Ranged, 2, 4, 4, 2, 2, 8],
  Arcanist: [TroopType.Ranged, 3, 8, 8, 4, 4, 16],
  GrandMarshal: [TroopType.Melee, 3, 16, 16, 16, 16, 16]
};

// # used to signal which side won the battle
// const COMBAT_OUTCOME_ATTACKER_WINS = 1
// const COMBAT_OUTCOME_DEFENDER_WINS = 2

export const ATTACKING_SQUAD_SLOT = 1;
export const DEFENDING_SQUAD_SLOT = 2;

function createIdToNameMap(map: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const key in map) {
    result[String(map[key])] = key.replace(/([a-z])([A-Z])/g, "$1 $2");
  }
  return result;
}
