import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { context } from "../context";
import {
  WalletResolver,
  RealmResolver,
  BuildingResolver,
  RealmTraitResolver,
  BuildingCostResolver,
  ResourceResolver
} from "../resolvers";
import {
  wallet,
  realm,
  building,
  resource,
  buildingCosts,
  realmTraits
} from "../db/testDB";

const Wallet = new WalletResolver();
const Realm = new RealmResolver();
const Building = new BuildingResolver();
const Resource = new ResourceResolver();
const RealmTrait = new RealmTraitResolver();
const BuildingCost = new BuildingCostResolver();

const prisma = new PrismaClient();

async function main() {
  try {
    await Wallet.createOrUpdateWallet(wallet, context);

    await Realm.createOrUpdateRealm(realm, context);

    await Building.createOrUpdateBuildings(building, context);

    await Resource.createOrUpdateResources(resource, context);

    for (let cost of buildingCosts) {
      await BuildingCost.createOrUpdateBuildingCost(cost, context);
    }
    for (let trait of realmTraits) {
      await RealmTrait.createOrUpdateRealmTrait(trait, context);
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
