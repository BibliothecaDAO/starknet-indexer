import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { context } from "../context";
import { BuildingResolver, BuildingCostResolver } from "../resolvers";
import { building, buildingCosts } from "../db/testDB";

const Building = new BuildingResolver();
const BuildingCost = new BuildingCostResolver();
const prisma = new PrismaClient();

export async function main() {
  try {
    await Building.createOrUpdateBuildings(building, context);

    for (let cost of buildingCosts) {
      await BuildingCost.createOrUpdateBuildingCost(cost, context);
    }
  } catch (e) {
    console.log(e);
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("done");
  });
