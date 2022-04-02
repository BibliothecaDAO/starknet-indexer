import "reflect-metadata";
import fetch from "node-fetch";
import { readFileSync } from "fs";
import { context } from "../context";
import {
  WalletResolver,
  RealmResolver,
  RealmTraitResolver,
  ResourceResolver
} from "../resolvers";
import { ResourceType } from "@prisma/client";

function getTraitsDb() {
  const data = readFileSync(__dirname + "/database.json", {
    encoding: "utf-8"
  });
  return JSON.parse(data);
}

const subgraphUrl =
  "https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/loot-ecosystem";

async function getRealms(first: number, last: string) {
  const response = await fetch(subgraphUrl, {
    method: "post",
    body: JSON.stringify({
      operationName: "getRealms",
      query: `
          query getRealms {
              realms(where:{id_gt:"${last}"} , first: ${first}, orderBy:id, orderDirection:asc) {
                  id
                  rarityScore
                  rarityRank
                  bridgedOwner {address}
                  currentOwner {address}
              }
          }
          `
    })
  });
  const result = await response.json();
  return result.data?.realms ?? [];
}

async function main() {
  const Wallet = new WalletResolver();
  const Realm = new RealmResolver();
  const Resource = new ResourceResolver();
  const RealmTrait = new RealmTraitResolver();

  const traitsDb = getTraitsDb();
  const first = 1000;
  let last = "";
  for (let skip = 0; skip < 8000; skip += first) {
    console.log(`Syncing realms ${skip} to ${skip + first}`);
    const realms = (await getRealms(first, last)).map((realm: any) => {
      return {
        ...realm,
        ...traitsDb[realm.id]
      };
    });

    if (realms.length === 0) {
      continue;
    }
    last = realms[realms.length - 1]?.id;

    for (let realm of realms) {
      const realmOwner = realm.currentOwner
        ? realm.currentOwner.address
        : undefined;

      // Update Wallet
      await Wallet.createOrUpdateWallet({ address: realmOwner }, context);

      // Update Realm
      await Realm.createOrUpdateRealm(
        {
          realmId: parseInt(realm.id),
          name: realm.name,
          owner: realmOwner,
          bridgedOwner: realm.bridgedOwner
            ? realm.bridgedOwner.address
            : undefined,
          imageUrl: realm.image,
          rarityRank: parseInt(realm.rarityRank),
          rarityScore: parseFloat(realm.rarityScore),
          orderType: realm.attributes
            .find((trait: any) => trait.trait_type === "Order")
            .value.replace("The Order of ", "")
            .replace(" ", "_")
        },
        context
      );

      // Add Resources and Traits
      for (let resource of realm.attributes) {
        if (resource.trait_type === "Resource") {
          const resourceType = (resource.value as string).replace(
            " ",
            "_"
          ) as ResourceType;
          await Resource.createOrUpdateResources(
            { type: resourceType, realmId: parseInt(realm.id) },
            context
          );
        } else if (
          ["Regions", "Cities", "Harbors", "Rivers"].indexOf(
            resource.trait_type
          ) > -1
        ) {
          const resourceType = resource.trait_type
            .replace("ies", "y")
            .replace("s", "");
          await RealmTrait.createOrUpdateRealmTrait(
            {
              type: resourceType,
              realmId: parseInt(realm.id),
              qty: parseInt(resource.value)
            },
            context
          );
        }
      }
    }

    if (realms.length < first) {
      break;
    }
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    console.log("done");
  });
