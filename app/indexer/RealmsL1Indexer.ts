import "reflect-metadata";
import { ethers } from "ethers";
import LootRealm from "../abis/LootRealm.json";
import fetch from "node-fetch";
import { readFileSync } from "fs";
import { Context } from "../context";
import { ResourceType } from "@prisma/client";
import {
  WalletResolver,
  RealmResolver,
  RealmTraitResolver,
  ResourceResolver
} from "../resolvers";
import { CONTRACTS, REALMS_L1_SUBGRAPH_URL } from "../utils/constants";

export class RealmsL1Indexer {
  context: Context;
  provider = new ethers.providers.JsonRpcProvider(
    `https://eth-mainnet.alchemyapi.io/v2/${process.env.PUBLIC_ALCHEMY_API_KEY}`
  );
  wallet = new WalletResolver();
  realm = new RealmResolver();
  resource = new ResourceResolver();
  realmTrait = new RealmTraitResolver();
  contract: ethers.Contract;

  constructor(context: Context) {
    this.context = context;
    this.contract = new ethers.Contract(
      CONTRACTS.REALMS_L1,
      LootRealm,
      this.provider
    );
  }

  async createOrUpdateRealmsFromSubgraph(realms: any[]) {
    for (let realm of realms) {
      const realmOwner = realm.currentOwner
        ? realm.currentOwner.address
        : undefined;

      const bridgedOwner = realm.bridgedOwner || realm.bridgedV2Owner;

      // Update Wallet
      await this.wallet.createOrUpdateWallet(
        { address: realmOwner },
        this.context
      );

      // Update BridgedOwner Wallet
      if (bridgedOwner && bridgedOwner.address) {
        await this.wallet.createOrUpdateWallet(
          { address: bridgedOwner.address },
          this.context
        );
      }

      // Update Realm
      await this.realm.createOrUpdateRealm(
        {
          realmId: parseInt(realm.id),
          name: realm.name,
          owner: realmOwner,
          bridgedOwner: bridgedOwner ? bridgedOwner.address : undefined,
          imageUrl: realm.image,
          wonder: realm.wonder,
          rarityRank: parseInt(realm.rarityRank),
          rarityScore: parseFloat(realm.rarityScore),
          orderType: realm.attributes
            .find((trait: any) => trait.trait_type === "Order")
            .value.replace("The Order of ", "")
            .replace(" ", "_")
        },
        this.context
      );

      // Add Resources and Traits
      for (let resource of realm.attributes) {
        if (resource.trait_type === "Resource") {
          const resourceType = (resource.value as string).replace(
            " ",
            "_"
          ) as ResourceType;
          await this.resource.createOrUpdateResources(
            { type: resourceType, realmId: parseInt(realm.id) },
            this.context
          );
        } else if (
          ["Regions", "Cities", "Harbors", "Rivers"].indexOf(
            resource.trait_type
          ) > -1
        ) {
          const resourceType = resource.trait_type
            .replace("ies", "y")
            .replace("s", "");
          await this.realmTrait.createOrUpdateRealmTrait(
            {
              type: resourceType,
              realmId: parseInt(realm.id),
              qty: parseInt(resource.value)
            },
            this.context
          );
        }
      }
    }
  }

  async updateRealmsOwnersFromSubgraph(realms: any[]) {
    for (let realm of realms) {
      const realmOwner = realm.currentOwner
        ? realm.currentOwner.address
        : undefined;

      const bridgedOwner = realm.bridgedOwner || realm.bridgedV2Owner || null;

      // Update Wallet
      await this.wallet.createOrUpdateWallet(
        { address: realmOwner },
        this.context
      );

      // Update BridgedOwner Wallet
      if (bridgedOwner && bridgedOwner.address) {
        await this.wallet.createOrUpdateWallet(
          { address: bridgedOwner.address },
          this.context
        );
      }

      // Update Owner
      await this.context.prisma.realm.update({
        where: { realmId: parseInt(realm.id) },
        data: {
          owner: realmOwner,
          bridgedOwner: bridgedOwner ? bridgedOwner.address : undefined
        }
      });
    }
  }

  async syncL1Subgraph() {
    const count = await this.context.prisma.realm.count();
    const doFullSync = count === 0;

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

      if (doFullSync) {
        this.createOrUpdateRealmsFromSubgraph(realms);
      } else {
        this.updateRealmsOwnersFromSubgraph(realms);
      }

      if (realms.length < first) {
        break;
      }
    }
  }

  async subscribeEvents() {
    const transferFilter = this.contract.filters.Transfer();
    this.contract.on(transferFilter, async (_from, _to, _, event) => {
      const args = event.args as any;
      if (!args || args.length < 3) {
        console.error(
          `Invalid realms transfer, transaction: ${event.transactionHash}`
        );
        return;
      }

      const realmId = parseInt(ethers.BigNumber.from(args[2]).toString());
      const from = args[0].toLowerCase();
      const to = args[1].toLowerCase();
      let bridgedOwner = null;
      if (to === CONTRACTS.JOURNEY || to === CONTRACTS.CARRACK) {
        bridgedOwner = from;
      }

      // Update Wallet
      await this.wallet.createOrUpdateWallet({ address: to }, this.context);

      await this.context.prisma.realm.update({
        where: { realmId },
        data: {
          owner: to,
          bridgedOwner
        }
      });
      console.info(`Realm transfered from ${from}, to ${to} `);
    });
  }

  async start() {
    await this.syncL1Subgraph();
    await this.subscribeEvents();
  }
}

function getTraitsDb() {
  const data = readFileSync(__dirname + "/../db/realmsL1DB.json", {
    encoding: "utf-8"
  });
  return JSON.parse(data);
}

async function getRealms(first: number, last: string) {
  const response = await fetch(REALMS_L1_SUBGRAPH_URL, {
    method: "post",
    body: JSON.stringify({
      operationName: "getRealms",
      query: `
          query getRealms {
              realms(where:{id_gt:"${last}"} , first: ${first}, orderBy:id, orderDirection:asc) {
                  id
                  rarityScore
                  rarityRank
                  wonder
                  bridgedOwner {address}
                  bridgedV2Owner {address}
                  currentOwner {address}
              }
          }
          `
    })
  });
  const result = await response.json();
  return result.data?.realms ?? [];
}
