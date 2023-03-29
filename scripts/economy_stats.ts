import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// async function get_settled_realms() {
//   const realms = await prisma.realm.findMany({
//     where: {
//       AND: [{ settledOwner: { not: null } }, { settledOwner: { not: "0x00" } }],
//     },
//     select: { realmId: true, name: true, settledOwner: true },
//   });
//   console.log(realms.length);
// }

async function get_buildings_per_realm() {
  const buildings = (
    await prisma.event.findMany({
      where: {
        name: "BuildingIntegrity",
      },
      select: { parameters: true, timestamp: true },
    })
  )
    .map(({ parameters, timestamp }) => {
      const realmId = parseInt(parameters[0]);
      const buildingId = parseInt(parameters[2]);
      const buildingIntegrity = parseInt(parameters[3]) || 0;
      return {
        realmId,
        buildingId,
        buildingName: BuildingName[buildingId],
        buildingIntegrity,
        timestamp,
        buildingCount: get_building_count(
          buildingIntegrity,
          timestamp,
          buildingId
        ),
      };
    })
    .map((row) => {
      return [
        row.realmId,
        row.buildingId,
        row.buildingName,
        row.buildingCount,
        row.timestamp.toISOString(),
      ];
    });
  console.log(buildings);
}

export async function get_current_buildings() {
  const buildings = (await prisma.building.findMany({}))
    .map((o) => {
      return {
        realmId: o.realmId,
        buildingId: o.buildingId,
        buildingName: BuildingName[o.buildingId],
        buildingIntegrity: o.buildingIntegrity,
        buildingCount: get_building_count(
          o.buildingIntegrity,
          new Date(),
          o.buildingId
        ),
      };
    })
    .filter((o) => o.buildingCount)
    .map((row) => {
      console.log(
        [row.realmId, row.buildingId, row.buildingName, row.buildingCount].join(
          ","
        )
      );
      return [row.realmId, row.buildingId, row.buildingName, row.buildingCount];
    });
  //   console.log(buildings);
  return buildings;
}

const BuildingName = [
  "",
  "House",
  "StoreHouse",
  "Granary",
  "Farm",
  "FishingVillage",
  "Barracks",
  "MageTower",
  "ArcherTower",
  "Castle",
];
const DAY = 86400;
const BuildingIntegrity = [
  0,
  3 * DAY,
  2000,
  2000,
  2000,
  2000,
  7 * DAY,
  7 * DAY,
  7 * DAY,
  7 * DAY,
];

import { ResourceNameById } from "./../app/utils/game_constants";

const get_building_count = (
  integrity: number,
  timestamp: any,
  buildingId: number
) => {
  const buildings = Math.floor(
    (integrity - new Date(timestamp).getTime() / 1000) /
      BuildingIntegrity[buildingId]
  );
  return buildings < 0 ? 0 : buildings;
};

async function get_resources_burn_by_wallet() {
  const balances = (
    await prisma.resourceTransfer.groupBy({
      by: ["resourceId", "fromAddress"],
      where: { toAddress: "0x00" },
      _sum: { amountValue: true },
      orderBy: [{ fromAddress: "asc" }, { resourceId: "asc" }],
    })
  ).map((o) => {
    console.log(
      [
        o.fromAddress,
        o.resourceId,
        ResourceNameById[o.resourceId],
        o._sum.amountValue,
      ].join(",")
    );
    return {
      wallet: o.fromAddress,
      resourceId: o.resourceId,
      resourceName: ResourceNameById[o.resourceId],
      amount: o._sum.amountValue,
    };
  });
  return balances;
  //   console.log(balances.slice(0, 4));
}

// get_buildings_per_realm();
// get_settled_realms();
// get_current_buildings();
get_resources_burn_by_wallet();
get_buildings_per_realm();
