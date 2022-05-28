export const Troop = {
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

export type TroopName = keyof typeof Troop;

export const Resource = {
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

export type ResourceName = keyof typeof Resource;

export const Building = {
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

export type BuildingName = keyof typeof Building;

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
      { resourceId: Resource.Wood, amount: 30 },
      { resourceId: Resource.Stone, amount: 50 },
      { resourceId: Resource.Copper, amount: 100 },
      { resourceId: Resource.Adamantine, amount: 4 },
      { resourceId: Resource.Mithral, amount: 1 },
      { resourceId: Resource.Dragonhide, amount: 1 }
    ]
  },
  Fairgrounds: {
    amount: 50,
    resources: [
      { resourceId: Resource.Wood, amount: 40 },
      { resourceId: Resource.Stone, amount: 50 },
      { resourceId: Resource.Silver, amount: 40 },
      { resourceId: Resource.AlchemicalSilver, amount: 8 },
      { resourceId: Resource.Mithral, amount: 1 },
      { resourceId: Resource.Dragonhide, amount: 1 }
    ]
  },
  GrandMarket: {
    amount: 50,
    resources: [
      { resourceId: Resource.Wood, amount: 35 },
      { resourceId: Resource.Stone, amount: 40 },
      { resourceId: Resource.Gold, amount: 20 },
      { resourceId: Resource.TwilightQuartz, amount: 10 },
      { resourceId: Resource.Mithral, amount: 1 },
      { resourceId: Resource.Dragonhide, amount: 1 }
    ]
  },
  Guild: {
    amount: 50,
    resources: [
      { resourceId: Resource.Wood, amount: 50 },
      { resourceId: Resource.Stone, amount: 50 },
      { resourceId: Resource.Coal, amount: 120 },
      { resourceId: Resource.EtherealSilica, amount: 12 },
      { resourceId: Resource.Mithral, amount: 2 },
      { resourceId: Resource.Dragonhide, amount: 1 }
    ]
  },
  OfficerAcademy: {
    amount: 50,
    resources: [
      { resourceId: Resource.Wood, amount: 40 },
      { resourceId: Resource.Stone, amount: 20 },
      { resourceId: Resource.ColdIron, amount: 45 },
      { resourceId: Resource.Ignium, amount: 12 },
      { resourceId: Resource.Mithral, amount: 1 },
      { resourceId: Resource.Dragonhide, amount: 1 }
    ]
  },
  RoyalReserve: {
    amount: 50,
    resources: [
      { resourceId: Resource.Wood, amount: 50 },
      { resourceId: Resource.Stone, amount: 20 },
      { resourceId: Resource.Ironwood, amount: 50 },
      { resourceId: Resource.TrueIce, amount: 10 },
      { resourceId: Resource.Mithral, amount: 1 },
      { resourceId: Resource.Dragonhide, amount: 1 }
    ]
  },
  Amphitheater: {
    amount: 10,
    resources: [
      { resourceId: Resource.Stone, amount: 5 },
      { resourceId: Resource.Diamonds, amount: 5 },
      { resourceId: Resource.Sapphire, amount: 1 },
      { resourceId: Resource.TwilightQuartz, amount: 2 }
    ]
  },
  ArcherTower: {
    amount: 5,
    resources: [
      { resourceId: Resource.Wood, amount: 10 },
      { resourceId: Resource.Stone, amount: 10 },
      { resourceId: Resource.Obsidian, amount: 25 },
      { resourceId: Resource.Ironwood, amount: 5 }
    ]
  },
  Architect: {
    amount: 15,
    resources: [
      { resourceId: Resource.Wood, amount: 10 },
      { resourceId: Resource.Stone, amount: 10 },
      { resourceId: Resource.Hartwood, amount: 13 },
      { resourceId: Resource.DeepCrystal, amount: 8 }
    ]
  },
  Barracks: {
    amount: 5,
    resources: [
      { resourceId: Resource.Wood, amount: 13 },
      { resourceId: Resource.Stone, amount: 10 },
      { resourceId: Resource.Obsidian, amount: 20 },
      { resourceId: Resource.Silver, amount: 10 }
    ]
  },
  Dock: {
    amount: 5,
    resources: [
      { resourceId: Resource.Stone, amount: 2 },
      { resourceId: Resource.Coal, amount: 15 },
      { resourceId: Resource.Ruby, amount: 4 }
    ]
  },
  Farms: {
    amount: 10,
    resources: [
      { resourceId: Resource.Wood, amount: 20 },
      { resourceId: Resource.Copper, amount: 5 },
      { resourceId: Resource.Silver, amount: 30 },
      { resourceId: Resource.Hartwood, amount: 10 }
    ]
  },
  Fishmonger: {
    amount: 10,
    resources: [
      { resourceId: Resource.Wood, amount: 30 },
      { resourceId: Resource.Obsidian, amount: 55 },
      { resourceId: Resource.Silver, amount: 6 },
      { resourceId: Resource.ColdIron, amount: 5 }
    ]
  },
  Granary: {
    amount: 15,
    resources: [
      { resourceId: Resource.Wood, amount: 10 },
      { resourceId: Resource.Obsidian, amount: 10 },
      { resourceId: Resource.EtherealSilica, amount: 4 },
      { resourceId: Resource.TrueIce, amount: 4 }
    ]
  },
  TradeOffice: {
    amount: 15,
    resources: [
      { resourceId: Resource.Wood, amount: 10 },
      { resourceId: Resource.Stone, amount: 4 },
      { resourceId: Resource.Gold, amount: 15 },
      { resourceId: Resource.Sapphire, amount: 10 }
    ]
  },
  Hamlet: {
    amount: 20,
    resources: [
      { resourceId: Resource.Wood, amount: 25 },
      { resourceId: Resource.ColdIron, amount: 20 },
      { resourceId: Resource.Gold, amount: 20 },
      { resourceId: Resource.Ruby, amount: 10 }
    ]
  },
  Housing: {
    amount: 35,
    resources: [
      { resourceId: Resource.Stone, amount: 50 },
      { resourceId: Resource.Coal, amount: 120 },
      { resourceId: Resource.Copper, amount: 120 },
      { resourceId: Resource.Ironwood, amount: 70 }
    ]
  },
  MageTower: {
    amount: 5,
    resources: [
      { resourceId: Resource.Wood, amount: 2 },
      { resourceId: Resource.Stone, amount: 2 },
      { resourceId: Resource.Diamonds, amount: 4 },
      { resourceId: Resource.Ignium, amount: 1 }
    ]
  },
  ParadeGrounds: {
    amount: 15,
    resources: [
      { resourceId: Resource.Stone, amount: 10 },
      { resourceId: Resource.Sapphire, amount: 4 },
      { resourceId: Resource.Ignium, amount: 4 },
      { resourceId: Resource.Adamantine, amount: 1 }
    ]
  },
  School: {
    amount: 1,
    resources: [
      { resourceId: Resource.Stone, amount: 10 },
      { resourceId: Resource.Diamonds, amount: 4 },
      { resourceId: Resource.DeepCrystal, amount: 3 },
      { resourceId: Resource.AlchemicalSilver, amount: 3 }
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
