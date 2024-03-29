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
  Goblin: 13,
};

export type TroopName = keyof typeof TroopId;

export const TroopNameById = createIdToNameMap(TroopId);

export const BattalionId = {
  LightCavalry: 1,
  HeavyCavalry: 2,
  Archer: 3,
  Longbow: 4,
  Mage: 5,
  Arcanist: 6,
  LightInfantry: 7,
  HeavyInfantry: 8,
} as const;

export type BattalionName = keyof typeof BattalionId;

export const BattalionNameById = createIdToNameMap(BattalionId);

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
  Dragonhide: 22,
  Wheat: 10000,
  Fish: 10001,
};

const ResourceTiers = {
  Wood: {
    rarity: 1,
    factor: 1,
    tier: 1,
  },
  Stone: {
    rarity: 1.27252,
    factor: 1.27252,
    tier: 1,
  },
  Coal: {
    rarity: 1.308375,
    factor: 1.308375,
    tier: 1,
  },
  Copper: {
    rarity: 1.897465,
    factor: 1.897465,
    tier: 1,
  },
  Obsidian: {
    rarity: 2.263087,
    factor: 2.263087,
    tier: 1,
  },
  Silver: {
    rarity: 2.880528,
    factor: 2.880528,
    tier: 1,
  },
  Ironwood: {
    rarity: 4.253605,
    factor: 4.253605,
    tier: 1,
  },
  ColdIron: {
    rarity: 5.240334,
    factor: 5.240334,
    tier: 1,
  },
  Gold: {
    rarity: 5.486871,
    factor: 1,
    tier: 2,
  },
  Hartwood: {
    rarity: 8.442761,
    factor: 1.53872052031112,
    tier: 2,
  },
  Diamonds: {
    rarity: 16.71667,
    factor: 3.04666721707144,
    tier: 2,
  },
  Sapphire: {
    rarity: 20.30364,
    factor: 3.7004041101021,
    tier: 2,
  },
  Ruby: {
    rarity: 20.98326,
    factor: 3.82426705493896,
    tier: 2,
  },
  DeepCrystal: {
    rarity: 20.98326,
    factor: 3.82426705493896,
    tier: 2,
  },
  Ignium: {
    rarity: 29.15698,
    factor: 5.31395398215121,
    tier: 2,
  },
  EtherealSilica: {
    rarity: 30.95679,
    factor: 1,
    tier: 3,
  },
  TrueIce: {
    rarity: 36.07914,
    factor: 1.16546773744952,
    tier: 3,
  },
  TwilightQuartz: {
    rarity: 45.18018,
    factor: 1.45945945945946,
    tier: 3,
  },
  AlchemicalSilver: {
    rarity: 53.92473,
    factor: 1.74193545260991,
    tier: 3,
  },
  Adamantine: {
    rarity: 91.18182,
    factor: 2.94545461593402,
    tier: 3,
  },
  Mithral: {
    rarity: 135.5405,
    factor: 4.37837708625474,
    tier: 3,
  },
  Dragonhide: {
    rarity: 218.0435,
    factor: 7.04347899120031,
    tier: 3,
  },
};

const ResourceTierConst = [0, 15, 17.5, 17.5];

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
  River: 4,
};
export type TraitName = keyof typeof TraitId;

export const TraitNameById = createIdToNameMap(TraitId);

export const ExternalContractId = {
  Lords: 1,
  Realms: 2,
  S_Realms: 3,
  Resources: 4,
  Treasury: 5,
  Storage: 6,
  Crypts: 7,
  S_Crypts: 8,
};

export type ExternalContractName = keyof typeof ExternalContractId;

export const ExternalContractNameById = createIdToNameMap(ExternalContractId);

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
  amount: +amount,
});

export const BuildingCost: { [key in BuildingName]: Cost } = {
  House: {
    amount: 0,
    resources: [],
  },
  StoreHouse: {
    amount: 0,
    resources: [],
  },
  Granary: {
    amount: 0,
    resources: [],
  },
  Farm: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Wood, 0.98),
      createResourceCost(ResourceId.Stone, 0.78),
      createResourceCost(ResourceId.Coal, 0.75),
      createResourceCost(ResourceId.Copper, 0.52),
      createResourceCost(ResourceId.Obsidian, 0.435),
      createResourceCost(ResourceId.Silver, 0.34),
      createResourceCost(ResourceId.Ironwood, 0.225),
      createResourceCost(ResourceId.ColdIron, 0.185),
      createResourceCost(ResourceId.Gold, 0.18),
      createResourceCost(ResourceId.Hartwood, 0.115),
    ],
  },
  FishingVillage: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Wood, 3.14),
      createResourceCost(ResourceId.Stone, 2.5),
      createResourceCost(ResourceId.Coal, 2.4),
      createResourceCost(ResourceId.Copper, 1.67),
      createResourceCost(ResourceId.Obsidian, 1.39),
      createResourceCost(ResourceId.Silver, 1.09),
      createResourceCost(ResourceId.Ironwood, 0.72),
      createResourceCost(ResourceId.ColdIron, 0.59),
      createResourceCost(ResourceId.Gold, 0.58),
      createResourceCost(ResourceId.Hartwood, 0.37),
    ],
  },
  Barracks: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Hartwood, 7),
      createResourceCost(ResourceId.Diamonds, 8),
      createResourceCost(ResourceId.DeepCrystal, 2.9),
      createResourceCost(ResourceId.Ignium, 3),
      createResourceCost(ResourceId.Adamantine, 6),
      createResourceCost(ResourceId.Dragonhide, 2),
    ],
  },
  MageTower: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Gold, 5),
      createResourceCost(ResourceId.Sapphire, 7),
      createResourceCost(ResourceId.Ignium, 2),
      createResourceCost(ResourceId.EtherealSilica, 2.3),
      createResourceCost(ResourceId.TrueIce, 5),
      createResourceCost(ResourceId.AlchemicalSilver, 3),
      createResourceCost(ResourceId.Adamantine, 6),
      createResourceCost(ResourceId.Mithral, 1),
    ],
  },
  ArcherTower: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Ironwood, 20),
      createResourceCost(ResourceId.Sapphire, 2),
      createResourceCost(ResourceId.Ruby, 3.6),
      createResourceCost(ResourceId.DeepCrystal, 4.1),
      createResourceCost(ResourceId.TrueIce, 4),
      createResourceCost(ResourceId.TwilightQuartz, 9),
      createResourceCost(ResourceId.AlchemicalSilver, 9),
    ],
  },
  Castle: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.ColdIron, 10),
      createResourceCost(ResourceId.Diamonds, 3),
      createResourceCost(ResourceId.Ruby, 4.4),
      createResourceCost(ResourceId.EtherealSilica, 3.8),
      createResourceCost(ResourceId.TwilightQuartz, 9),
      createResourceCost(ResourceId.Mithral, 3.5),
      createResourceCost(ResourceId.Dragonhide, 0.6),
    ],
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
  Magic: 4,
};

//Troop(type=TroopType.Melee, tier=1, building=BuildingId.ArcherTower agility=1, attack=1, armor=3, vitality=4, wisdom=1),
export const TroopStat: { [key in TroopName]: number[] } = {
  Skirmisher: [TroopType.Ranged, 1, BuildingId.ArcherTower, 8, 6, 2, 30, 3],
  Longbow: [TroopType.Ranged, 2, BuildingId.ArcherTower, 10, 8, 3, 40, 4],
  Crossbow: [TroopType.Ranged, 3, BuildingId.ArcherTower, 12, 10, 4, 60, 4],
  Pikeman: [TroopType.Melee, 1, BuildingId.Barracks, 2, 6, 4, 30, 4],
  Knight: [TroopType.Melee, 2, BuildingId.Barracks, 3, 8, 6, 60, 6],
  Paladin: [TroopType.Melee, 3, BuildingId.Barracks, 4, 10, 8, 80, 8],
  Ballista: [TroopType.Siege, 1, BuildingId.Castle, 2, 8, 2, 30, 2],
  Mangonel: [TroopType.Siege, 2, BuildingId.Castle, 3, 10, 3, 50, 3],
  Trebuchet: [TroopType.Siege, 3, BuildingId.Castle, 4, 12, 4, 70, 4],
  Apprentice: [TroopType.Magic, 1, BuildingId.MageTower, 6, 6, 2, 40, 6],
  Mage: [TroopType.Magic, 2, BuildingId.MageTower, 8, 8, 3, 50, 8],
  Arcanist: [TroopType.Magic, 3, BuildingId.MageTower, 10, 10, 4, 80, 10],
  Goblin: [TroopType.Melee, 1, 0, 3, 8, 2, 20, 1],
};

export const TroopCost: { [key in TroopName]: Cost } = {
  Skirmisher: {
    amount: 0,
    resources: [createResourceCost(ResourceId.AlchemicalSilver, 1)],
  },
  Longbow: {
    amount: 0,
    resources: [createResourceCost(ResourceId.Adamantine, 0.5)],
  },
  Crossbow: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Stone, 4),
      createResourceCost(ResourceId.Gold, 2),
      createResourceCost(ResourceId.Mithral, 0.5),
      createResourceCost(ResourceId.Dragonhide, 0.3),
    ],
  },
  Pikeman: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Diamonds, 1),
      createResourceCost(ResourceId.Ignium, 0.5),
    ],
  },
  Knight: {
    amount: 0,
    resources: [createResourceCost(ResourceId.Sapphire, 3)],
  },
  Paladin: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.ColdIron, 2),
      createResourceCost(ResourceId.Diamonds, 2),
      createResourceCost(ResourceId.Ruby, 3),
      createResourceCost(ResourceId.DeepCrystal, 3),
    ],
  },
  Ballista: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Wood, 5),
      createResourceCost(ResourceId.Stone, 4),
      createResourceCost(ResourceId.Coal, 2),
    ],
  },
  Mangonel: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Wood, 5),
      createResourceCost(ResourceId.Stone, 4),
      createResourceCost(ResourceId.Coal, 2),
      createResourceCost(ResourceId.Silver, 2),
    ],
  },
  Trebuchet: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Wood, 5),
      createResourceCost(ResourceId.Coal, 2),
      createResourceCost(ResourceId.Obsidian, 2),
      createResourceCost(ResourceId.Ironwood, 2),
    ],
  },
  Apprentice: {
    amount: 0,
    resources: [createResourceCost(ResourceId.Ignium, 1)],
  },
  Mage: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Diamonds, 1),
      createResourceCost(ResourceId.EtherealSilica, 2),
    ],
  },
  Arcanist: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Gold, 2),
      createResourceCost(ResourceId.Hartwood, 2),
      createResourceCost(ResourceId.TrueIce, 2),
      createResourceCost(ResourceId.TwilightQuartz, 1),
    ],
  },
  Goblin: {
    amount: 0,
    resources: [],
  },
};

export const BattalionCost: { [key in BattalionName]: Cost } = {
  LightCavalry: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Wood, 0.6),
      createResourceCost(ResourceId.Obsidian, 0.3),
      createResourceCost(ResourceId.ColdIron, 0.099),
      createResourceCost(ResourceId.Sapphire, 0.131),
    ],
  },
  HeavyCavalry: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Silver, 0.555),
      createResourceCost(ResourceId.Hartwood, 0.1),
      createResourceCost(ResourceId.Diamonds, 0.17),
      createResourceCost(ResourceId.EtherealSilica, 0.08),
      createResourceCost(ResourceId.TrueIce, 0.045),
      createResourceCost(ResourceId.AlchemicalSilver, 0.02),
      createResourceCost(ResourceId.Adamantine, 0.04),
      createResourceCost(ResourceId.Mithral, 0.012),
    ],
  },
  Archer: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Wood, 0.6),
      createResourceCost(ResourceId.Coal, 0.65),
      createResourceCost(ResourceId.Silver, 0.12),
      createResourceCost(ResourceId.Sapphire, 0.131),
    ],
  },
  Longbow: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Stone, 0.9),
      createResourceCost(ResourceId.Obsidian, 0.55),
      createResourceCost(ResourceId.Ironwood, 0.3),
      createResourceCost(ResourceId.Gold, 0.14),
      createResourceCost(ResourceId.Ruby, 0.197),
      createResourceCost(ResourceId.DeepCrystal, 0.055),
      createResourceCost(ResourceId.TwilightQuartz, 0.027),
      createResourceCost(ResourceId.AlchemicalSilver, 0.072),
      createResourceCost(ResourceId.Adamantine, 0.01),
    ],
  },
  Mage: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Coal, 0.772),
      createResourceCost(ResourceId.ColdIron, 0.129),
      createResourceCost(ResourceId.Ignium, 0.095),
    ],
  },
  Arcanist: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Stone, 0.6),
      createResourceCost(ResourceId.Copper, 0.42),
      createResourceCost(ResourceId.Hartwood, 0.12),
      createResourceCost(ResourceId.Diamonds, 0.15),
      createResourceCost(ResourceId.DeepCrystal, 0.2),
      createResourceCost(ResourceId.TwilightQuartz, 0.08),
      createResourceCost(ResourceId.Dragonhide, 0.013),
    ],
  },
  LightInfantry: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Copper, 0.6),
      createResourceCost(ResourceId.ColdIron, 0.132),
      createResourceCost(ResourceId.Ignium, 0.09),
    ],
  },
  HeavyInfantry: {
    amount: 0,
    resources: [
      createResourceCost(ResourceId.Wood, 0.7),
      createResourceCost(ResourceId.Ironwood, 0.145),
      createResourceCost(ResourceId.Gold, 0.2),
      createResourceCost(ResourceId.Ruby, 0.06),
      createResourceCost(ResourceId.EtherealSilica, 0.093),
      createResourceCost(ResourceId.TrueIce, 0.1),
      createResourceCost(ResourceId.Mithral, 0.025),
      createResourceCost(ResourceId.Dragonhide, 0.01),
    ],
  },
};

export const BattalionBuildingRequirement: { [key in BattalionName]: number } =
  {
    LightCavalry: BuildingId.Castle,
    HeavyCavalry: BuildingId.Castle,
    Archer: BuildingId.ArcherTower,
    Longbow: BuildingId.ArcherTower,
    Mage: BuildingId.MageTower,
    Arcanist: BuildingId.MageTower,
    LightInfantry: BuildingId.Barracks,
    HeavyInfantry: BuildingId.Barracks,
  };

function createBattalionStatistic(
  battalionId: number,
  combatType: "attack" | "defense",
  type: string,
  value: number
) {
  const battalionName = BattalionNameById[battalionId].replace(
    " ",
    ""
  ) as BattalionName;
  const buildingId = BattalionBuildingRequirement[battalionName];
  return {
    combatType,
    type,
    battalionId,
    battalionName,
    requiredBuildingId: buildingId,
    requiredBuildingName: BuildingNameById[buildingId],
    value,
  };
}

export const BattalionStats = [
  // Attack
  createBattalionStatistic(BattalionId.LightCavalry, "attack", "", 20),
  createBattalionStatistic(BattalionId.HeavyCavalry, "attack", "", 30),
  createBattalionStatistic(BattalionId.Archer, "attack", "", 20),
  createBattalionStatistic(BattalionId.Longbow, "attack", "", 30),
  createBattalionStatistic(BattalionId.Mage, "attack", "", 20),
  createBattalionStatistic(BattalionId.Arcanist, "attack", "", 30),
  createBattalionStatistic(BattalionId.LightInfantry, "attack", "", 20),
  createBattalionStatistic(BattalionId.HeavyInfantry, "attack", "", 30),

  // Defense
  // Cavalry
  createBattalionStatistic(BattalionId.LightCavalry, "defense", "cavalry", 20),
  createBattalionStatistic(BattalionId.HeavyCavalry, "defense", "cavalry", 30),
  createBattalionStatistic(BattalionId.Archer, "defense", "cavalry", 15),
  createBattalionStatistic(BattalionId.Longbow, "defense", "cavalry", 25),
  createBattalionStatistic(BattalionId.Mage, "defense", "cavalry", 25),
  createBattalionStatistic(BattalionId.Arcanist, "defense", "cavalry", 35),
  createBattalionStatistic(BattalionId.LightInfantry, "defense", "cavalry", 25),
  createBattalionStatistic(BattalionId.HeavyInfantry, "defense", "cavalry", 35),

  // Archery
  createBattalionStatistic(BattalionId.LightCavalry, "defense", "archery", 25),
  createBattalionStatistic(BattalionId.HeavyCavalry, "defense", "archery", 35),
  createBattalionStatistic(BattalionId.Archer, "defense", "archery", 20),
  createBattalionStatistic(BattalionId.Longbow, "defense", "archery", 30),
  createBattalionStatistic(BattalionId.Mage, "defense", "archery", 15),
  createBattalionStatistic(BattalionId.Arcanist, "defense", "archery", 25),
  createBattalionStatistic(BattalionId.LightInfantry, "defense", "archery", 25),
  createBattalionStatistic(BattalionId.HeavyInfantry, "defense", "archery", 35),

  // Magic
  createBattalionStatistic(BattalionId.LightCavalry, "defense", "magic", 25),
  createBattalionStatistic(BattalionId.HeavyCavalry, "defense", "magic", 35),
  createBattalionStatistic(BattalionId.Archer, "defense", "magic", 25),
  createBattalionStatistic(BattalionId.Longbow, "defense", "magic", 35),
  createBattalionStatistic(BattalionId.Mage, "defense", "magic", 20),
  createBattalionStatistic(BattalionId.Arcanist, "defense", "magic", 30),
  createBattalionStatistic(BattalionId.LightInfantry, "defense", "magic", 15),
  createBattalionStatistic(BattalionId.HeavyInfantry, "defense", "magic", 25),

  // Infantry
  createBattalionStatistic(BattalionId.LightCavalry, "defense", "infantry", 15),
  createBattalionStatistic(BattalionId.HeavyCavalry, "defense", "infantry", 25),
  createBattalionStatistic(BattalionId.Archer, "defense", "infantry", 25),
  createBattalionStatistic(BattalionId.Longbow, "defense", "infantry", 35),
  createBattalionStatistic(BattalionId.Mage, "defense", "infantry", 25),
  createBattalionStatistic(BattalionId.Arcanist, "defense", "infantry", 35),
  createBattalionStatistic(
    BattalionId.LightInfantry,
    "defense",
    "infantry",
    20
  ),
  createBattalionStatistic(
    BattalionId.HeavyInfantry,
    "defense",
    "infantry",
    30
  ),
];

// # used to signal which side won the battle
export const COMBAT_OUTCOME_ATTACKER_WINS = 1;
export const COMBAT_OUTCOME_DEFENDER_WINS = 0;

export const GOBLIN_SQUAD_SLOT = 0;
export const ATTACKING_SQUAD_SLOT = 1;
export const DEFENDING_SQUAD_SLOT = 2;

function createIdToNameMap(map: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const key in map) {
    result[String(map[key])] = key.replace(/([a-z])([A-Z])/g, "$1 $2");
  }
  return result;
}

export function outputResourceLaborAndToolCosts(tier: 1 | 2 | 3) {
  const resources = Object.keys(ResourceTiers)
    .map((name: string) => {
      return {
        resourceId: (ResourceId as any)[name],
        resourceName: name,
        ...(ResourceTiers as any)[name],
      };
    })
    .filter((resource: any) => resource.tier === tier);
  const costs = [] as any[];
  const tierConstant = ResourceTierConst[tier];
  for (let resource of resources) {
    costs.push({
      name: resource.resourceName,
      tier: resource.tier,
      ...resources.reduce((ctx: any, cur: any) => {
        ctx[cur.resourceName] =
          cur.resourceId == resource.resourceId
            ? 0
            : +((tierConstant / cur.factor) * resource.factor).toFixed(2);
        return ctx;
      }, {}),
    });
  }
  console.table(costs);
}

function createResourceLaborAndToolCosts(tier: 1 | 2 | 3) {
  const resources = Object.keys(ResourceTiers)
    .map((name: string) => {
      return {
        resourceId: (ResourceId as any)[name],
        resourceName: name,
        ...(ResourceTiers as any)[name],
      };
    })
    .filter((resource: any) => resource.tier === tier);
  const costs = [] as any[];
  const tierConstant = ResourceTierConst[tier];
  for (let resource of resources) {
    costs.push({
      resourceId: resource.resourceId,
      resourceName: resource.resourceName,
      tier: resource.tier,
      costs: resources
        .map((current: any) => {
          return {
            resourceId: current.resourceId,
            resourceName: current.resourceName,
            amount:
              current.resourceId == resource.resourceId
                ? 0
                : +((tierConstant / current.factor) * resource.factor).toFixed(
                    2
                  ),
          };
        })
        .filter((cost) => cost.amount > 0),
    });
  }
  return costs;
}

export const ResourceLaborAndToolCosts = [
  ...createResourceLaborAndToolCosts(1),
  ...createResourceLaborAndToolCosts(2),
  ...createResourceLaborAndToolCosts(3),
];

export const Orders = {
  Power: 1,
  Giants: 2,
  Titans: 3,
  Skill: 4,
  Perfection: 5,
  Brilliance: 6,
  Enlightenment: 7,
  Protection: 8,
  Anger: 9,
  Rage: 10,
  Fury: 11,
  Vitriol: 12,
  the_Fox: 13,
  Detection: 14,
  Reflection: 15,
  the_Twins: 16,
} as const;
