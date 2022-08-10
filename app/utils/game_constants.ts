export const TroopId = {
  Skirmisher: 1,
  Longbow: 2,
  Crossbow: 3,
  Pikeman: 4,
  Knight: 5,
  Paladin: 6,
  Ballista: 7,
  Mangonel: 8,
  Trebuchet: 9,
  Apprentice: 10,
  Mage: 11,
  Arcanist: 12,
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
  House: 1,
  StoreHouse: 2,
  Granary: 3,
  Farm: 4,
  FishingVillage: 5,
  Barracks: 6,
  MageTower: 7,
  ArcherTower: 8,
  Castle: 9,
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
  House: {
    amount: 50,
    resources: [
    ]
  },
  StoreHouse: {
    amount: 50,
    resources: []
  },
  Granary: {
    amount: 50,
    resources: [
    ]
  },
  Farm: {
    amount: 50,
    resources: [
      createResourceCost(ResourceId.Wood, 15),
      createResourceCost(ResourceId.Stone, 10),
      createResourceCost(ResourceId.Coal, 14),
      createResourceCost(ResourceId.Copper, 7),
      createResourceCost(ResourceId.Obsidian, 8),
      createResourceCost(ResourceId.Silver, 4),
      createResourceCost(ResourceId.Ironwood, 3),
      createResourceCost(ResourceId.ColdIron, 2),
      createResourceCost(ResourceId.Gold, 3)
    ]
  },
  FishingVillage: {
    amount: 50,
    resources: [
      createResourceCost(ResourceId.Wood, 15),
      createResourceCost(ResourceId.Stone, 13),
      createResourceCost(ResourceId.Copper, 7),
      createResourceCost(ResourceId.Silver, 8),
      createResourceCost(ResourceId.Ironwood, 4),
      createResourceCost(ResourceId.ColdIron, 3),
      createResourceCost(ResourceId.Hartwood, 3)
    ]
  },
  Barracks: {
    amount: 50,
    resources: [
      createResourceCost(ResourceId.ColdIron, 10),
      createResourceCost(ResourceId.Gold, 7),
      createResourceCost(ResourceId.Hartwood, 18),
      createResourceCost(ResourceId.Sapphire, 20),
      createResourceCost(ResourceId.DeepCrystal, 10),
      createResourceCost(ResourceId.TrueIce, 12),
      createResourceCost(ResourceId.Dragonhide, 2)

    ]
  },
  MageTower: {
    amount: 10,
    resources: [
      createResourceCost(ResourceId.Gold,5),
      createResourceCost(ResourceId.Hartwood, 12),
      createResourceCost(ResourceId.Diamonds, 25),
      createResourceCost(ResourceId.Ignium, 6),
      createResourceCost(ResourceId.EtherealSilica, 10),
      createResourceCost(ResourceId.TrueIce, 5),
      createResourceCost(ResourceId.TwilightQuartz, 2),
      createResourceCost(ResourceId.AlchemicalSilver, 3),
      createResourceCost(ResourceId.Mithral, 2)

    ]
  },
  ArcherTower: {
    amount: 5,
    resources: [
      createResourceCost(ResourceId.ColdIron, 10),
      createResourceCost(ResourceId.Gold, 5),
      createResourceCost(ResourceId.Hartwood, 10),
      createResourceCost(ResourceId.Sapphire, 7),
      createResourceCost(ResourceId.Ruby, 12),
      createResourceCost(ResourceId.DeepCrystal, 12),
      createResourceCost(ResourceId.AlchemicalSilver, 7),
      createResourceCost(ResourceId.Adamantine, 6)
    ]
  },
  Castle: {
    amount: 15,
    resources: [
      createResourceCost(ResourceId.Gold, 5),
      createResourceCost(ResourceId.Hartwood, 10),
      createResourceCost(ResourceId.Diamonds, 10),
      createResourceCost(ResourceId.Ruby, 14),
      createResourceCost(ResourceId.Ignium, 10),
      createResourceCost(ResourceId.EtherealSilica, 9),
      createResourceCost(ResourceId.TwilightQuartz, 10),
      createResourceCost(ResourceId.Mithral, 1)
    ]
  },
};

export const BuildingLimitTrait: { [key in BuildingName]: number } = {
  House: TraitId.Region,
  StoreHouse: TraitId.Region,
  Granary: TraitId.Region,
  Farm: TraitId.Region,
  FishingVillage: TraitId.Region,
  Barracks: TraitId.Region,
  MageTower: TraitId.Region,
  ArcherTower: TraitId.Region,
  Castle: TraitId.Region,
};

export const BuildingSize: { [key in BuildingName]: number } = {
  House: 2,
  StoreHouse: 3,
  Granary: 3,
  Farm: 3,
  FishingVillage: 3,
  Barracks: 6,
  MageTower: 6,
  ArcherTower: 6,
  Castle: 12,
};

export const BuildingFood: { [key in BuildingName]: number } = {
  House: 2,
  StoreHouse: 3,
  Granary: 3,
  Farm: 3,
  FishingVillage: 3,
  Barracks: 6,
  MageTower: 6,
  ArcherTower: 6,
  Castle: 12,
};

export const BuildingCulture: { [key in BuildingName]: number } = {
  House: 2,
  StoreHouse: 3,
  Granary: 3,
  Farm: 3,
  FishingVillage: 3,
  Barracks: 6,
  MageTower: 6,
  ArcherTower: 6,
  Castle: 12,
};

export const BuildingPopulation: { [key in BuildingName]: number } = {
  House: 2,
  StoreHouse: 3,
  Granary: 3,
  Farm: 3,
  FishingVillage: 3,
  Barracks: 6,
  MageTower: 6,
  ArcherTower: 6,
  Castle: 12,
};

export const TroopType = {
  Melee: 1,
  Ranged: 2,
  Siege: 3,
  Magic: 4
};

//Troop(type=TroopType.Melee, tier=1, agility=1, attack=1, armor=3, vitality=4, wisdom=1),
export const TroopStat: { [key in TroopName]: number[] } = {
  Skirmisher: [TroopType.Ranged, 1, 2, 7, 2, 53, 2],
  Longbow: [TroopType.Ranged, 2, 4, 7, 3, 53, 3],
  Crossbow: [TroopType.Ranged, 3, 6, 9, 4, 53, 4],
  Pikeman: [TroopType.Melee, 1, 7, 4, 5, 53, 1],
  Knight: [TroopType.Melee, 2, 9, 7, 8, 79, 2],
  Paladin: [TroopType.Melee, 3, 9, 9, 9, 106, 3],
  Ballista: [TroopType.Siege, 1, 4, 11, 4, 53, 2],
  Mangonel: [TroopType.Siege, 2, 4, 10, 5, 53, 3],
  Trebuchet: [TroopType.Siege, 3, 4, 12, 6, 53, 4],
  Apprentice: [TroopType.Magic, 1, 7, 7, 2, 53, 8],
  Mage: [TroopType.Magic, 2, 7, 9, 2, 53, 9],
  Arcanist: [TroopType.Magic, 3, 7, 11, 2, 53, 10],
};

export const TroopCost: { [key in TroopName]: Cost } = {
  Skirmisher: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.AlchemicalSilver, 1)
    ]
  },
  Longbow: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Adamantine, 0.5),
    ]
  },
  Crossbow: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Stone, 4),
      createResourceCost(ResourceId.Gold, 2),
      createResourceCost(ResourceId.Mithral, 0.5),
      createResourceCost(ResourceId.Dragonhide, 0.3)
    ]
  },
  Pikeman: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Diamonds, 1),
      createResourceCost(ResourceId.Ignium, 0.5),
    ]
  },
  Knight: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Sapphire, 3),
    ]
  },
  Paladin: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.ColdIron, 2),
      createResourceCost(ResourceId.Diamonds, 2),
      createResourceCost(ResourceId.Ruby, 3),
      createResourceCost(ResourceId.DeepCrystal, 3)
    ]
  },
  Ballista: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Wood, 5),
      createResourceCost(ResourceId.Stone, 4),
      createResourceCost(ResourceId.Coal, 2)
    ]
  },
  Mangonel: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Wood, 5),
      createResourceCost(ResourceId.Stone, 4),
      createResourceCost(ResourceId.Coal, 2),
      createResourceCost(ResourceId.Silver, 2)
    ]
  },
  Trebuchet: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Wood, 5),
      createResourceCost(ResourceId.Coal, 2),
      createResourceCost(ResourceId.Obsidian, 2),
      createResourceCost(ResourceId.Ironwood, 2)
    ]
  },
  Apprentice: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Ignium, 1),
    ]
  },
  Mage: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Diamonds, 1),
      createResourceCost(ResourceId.EtherealSilica, 2),
    ]
  },
  Arcanist: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Gold, 2),
      createResourceCost(ResourceId.Hartwood, 2),
      createResourceCost(ResourceId.TrueIce, 2),
      createResourceCost(ResourceId.TwilightQuartz, 1)
    ]
  },
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
