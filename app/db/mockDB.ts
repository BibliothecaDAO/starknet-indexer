import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { context } from "../context";
import {
  // BuildingResolver,
  // BuildingCostResolver,
  SquadResolver,
  SquadCostResolver
} from "../resolvers";
import {
  // building,
  // buildingCosts,
  squadCosts,
  offenceSquad,
  defenceSquad
} from "../db/testDB";

// const Building = new BuildingResolver();
// const BuildingCost = new BuildingCostResolver();
const Squad = new SquadResolver();
const SquadCost = new SquadCostResolver();

const prisma = new PrismaClient();

export async function main() {
  try {
    // await Building.createOrUpdateBuildings(building, context);

    // for (let cost of buildingCosts) {
    //   await BuildingCost.createOrUpdateBuildingCost(cost, context);
    // }

    for (let cost of squadCosts) {
      await SquadCost.createOrUpdateSquadCost(cost, context);
    }

    await Squad.createOrUpdateSquad(offenceSquad, context);
    await Squad.createOrUpdateSquad(defenceSquad, context);
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
