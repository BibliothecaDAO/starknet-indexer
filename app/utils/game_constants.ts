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

interface ResourceCost {
  resourceId: number;
  amount: number;
}

interface Cost {
  amount: number;
  resources: ResourceCost[];
}

export const BuildingCost: { [key in BuildingName]: Cost } = {
  Castle: {
    amount: 50,
    resources: [
      { resourceId: ResourceId.Wood, amount: 30 },
      { resourceId: ResourceId.Stone, amount: 50 },
      { resourceId: ResourceId.Copper, amount: 100 },
      { resourceId: ResourceId.Adamantine, amount: 4 },
      { resourceId: ResourceId.Mithral, amount: 1 },
      { resourceId: ResourceId.Dragonhide, amount: 1 }
    ]
  },
  Fairgrounds: {
    amount: 50,
    resources: [
      { resourceId: ResourceId.Wood, amount: 40 },
      { resourceId: ResourceId.Stone, amount: 50 },
      { resourceId: ResourceId.Silver, amount: 40 },
      { resourceId: ResourceId.AlchemicalSilver, amount: 8 },
      { resourceId: ResourceId.Mithral, amount: 1 },
      { resourceId: ResourceId.Dragonhide, amount: 1 }
    ]
  },
  GrandMarket: {
    amount: 50,
    resources: [
      { resourceId: ResourceId.Wood, amount: 35 },
      { resourceId: ResourceId.Stone, amount: 40 },
      { resourceId: ResourceId.Gold, amount: 20 },
      { resourceId: ResourceId.TwilightQuartz, amount: 10 },
      { resourceId: ResourceId.Mithral, amount: 1 },
      { resourceId: ResourceId.Dragonhide, amount: 1 }
    ]
  },
  Guild: {
    amount: 50,
    resources: [
      { resourceId: ResourceId.Wood, amount: 50 },
      { resourceId: ResourceId.Stone, amount: 50 },
      { resourceId: ResourceId.Coal, amount: 120 },
      { resourceId: ResourceId.EtherealSilica, amount: 12 },
      { resourceId: ResourceId.Mithral, amount: 2 },
      { resourceId: ResourceId.Dragonhide, amount: 1 }
    ]
  },
  OfficerAcademy: {
    amount: 50,
    resources: [
      { resourceId: ResourceId.Wood, amount: 40 },
      { resourceId: ResourceId.Stone, amount: 20 },
      { resourceId: ResourceId.ColdIron, amount: 45 },
      { resourceId: ResourceId.Ignium, amount: 12 },
      { resourceId: ResourceId.Mithral, amount: 1 },
      { resourceId: ResourceId.Dragonhide, amount: 1 }
    ]
  },
  RoyalReserve: {
    amount: 50,
    resources: [
      { resourceId: ResourceId.Wood, amount: 50 },
      { resourceId: ResourceId.Stone, amount: 20 },
      { resourceId: ResourceId.Ironwood, amount: 50 },
      { resourceId: ResourceId.TrueIce, amount: 10 },
      { resourceId: ResourceId.Mithral, amount: 1 },
      { resourceId: ResourceId.Dragonhide, amount: 1 }
    ]
  },
  Amphitheater: {
    amount: 10,
    resources: [
      { resourceId: ResourceId.Stone, amount: 5 },
      { resourceId: ResourceId.Diamonds, amount: 5 },
      { resourceId: ResourceId.Sapphire, amount: 1 },
      { resourceId: ResourceId.TwilightQuartz, amount: 2 }
    ]
  },
  ArcherTower: {
    amount: 5,
    resources: [
      { resourceId: ResourceId.Wood, amount: 10 },
      { resourceId: ResourceId.Stone, amount: 10 },
      { resourceId: ResourceId.Obsidian, amount: 25 },
      { resourceId: ResourceId.Ironwood, amount: 5 }
    ]
  },
  Architect: {
    amount: 15,
    resources: [
      { resourceId: ResourceId.Wood, amount: 10 },
      { resourceId: ResourceId.Stone, amount: 10 },
      { resourceId: ResourceId.Hartwood, amount: 13 },
      { resourceId: ResourceId.DeepCrystal, amount: 8 }
    ]
  },
  Barracks: {
    amount: 5,
    resources: [
      { resourceId: ResourceId.Wood, amount: 13 },
      { resourceId: ResourceId.Stone, amount: 10 },
      { resourceId: ResourceId.Obsidian, amount: 20 },
      { resourceId: ResourceId.Silver, amount: 10 }
    ]
  },
  Dock: {
    amount: 5,
    resources: [
      { resourceId: ResourceId.Stone, amount: 2 },
      { resourceId: ResourceId.Coal, amount: 15 },
      { resourceId: ResourceId.Ruby, amount: 4 }
    ]
  },
  Farms: {
    amount: 10,
    resources: [
      { resourceId: ResourceId.Wood, amount: 20 },
      { resourceId: ResourceId.Copper, amount: 5 },
      { resourceId: ResourceId.Silver, amount: 30 },
      { resourceId: ResourceId.Hartwood, amount: 10 }
    ]
  },
  Fishmonger: {
    amount: 10,
    resources: [
      { resourceId: ResourceId.Wood, amount: 30 },
      { resourceId: ResourceId.Obsidian, amount: 55 },
      { resourceId: ResourceId.Silver, amount: 6 },
      { resourceId: ResourceId.ColdIron, amount: 5 }
    ]
  },
  Granary: {
    amount: 15,
    resources: [
      { resourceId: ResourceId.Wood, amount: 10 },
      { resourceId: ResourceId.Obsidian, amount: 10 },
      { resourceId: ResourceId.EtherealSilica, amount: 4 },
      { resourceId: ResourceId.TrueIce, amount: 4 }
    ]
  },
  TradeOffice: {
    amount: 15,
    resources: [
      { resourceId: ResourceId.Wood, amount: 10 },
      { resourceId: ResourceId.Stone, amount: 4 },
      { resourceId: ResourceId.Gold, amount: 15 },
      { resourceId: ResourceId.Sapphire, amount: 10 }
    ]
  },
  Hamlet: {
    amount: 20,
    resources: [
      { resourceId: ResourceId.Wood, amount: 25 },
      { resourceId: ResourceId.ColdIron, amount: 20 },
      { resourceId: ResourceId.Gold, amount: 20 },
      { resourceId: ResourceId.Ruby, amount: 10 }
    ]
  },
  Housing: {
    amount: 35,
    resources: [
      { resourceId: ResourceId.Stone, amount: 50 },
      { resourceId: ResourceId.Coal, amount: 120 },
      { resourceId: ResourceId.Copper, amount: 120 },
      { resourceId: ResourceId.Ironwood, amount: 70 }
    ]
  },
  MageTower: {
    amount: 5,
    resources: [
      { resourceId: ResourceId.Wood, amount: 2 },
      { resourceId: ResourceId.Stone, amount: 2 },
      { resourceId: ResourceId.Diamonds, amount: 4 },
      { resourceId: ResourceId.Ignium, amount: 1 }
    ]
  },
  ParadeGrounds: {
    amount: 15,
    resources: [
      { resourceId: ResourceId.Stone, amount: 10 },
      { resourceId: ResourceId.Sapphire, amount: 4 },
      { resourceId: ResourceId.Ignium, amount: 4 },
      { resourceId: ResourceId.Adamantine, amount: 1 }
    ]
  },
  School: {
    amount: 1,
    resources: [
      { resourceId: ResourceId.Stone, amount: 10 },
      { resourceId: ResourceId.Diamonds, amount: 4 },
      { resourceId: ResourceId.DeepCrystal, amount: 3 },
      { resourceId: ResourceId.AlchemicalSilver, amount: 3 }
    ]
  }
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
    result[String(map[key])] = key.replace(/[a-z]([A-Z])/g, " $1");
  }
  return result;
}
