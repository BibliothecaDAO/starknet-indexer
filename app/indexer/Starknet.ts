import fetch from "node-fetch";
import { StarkNetEvent, StarkNetResponse } from "../types";
import { contract, fromBlock } from "./utils";
import { Context, context } from "../context";

import { WalletResolver } from "../resolvers";
import { wallet } from "../db/testDB";
import { Indexer } from "../types";
import DesiegeIndexer from "./DesiegeIndexer";
const StarkNetUrl = "http://starknet.events/api/v1/get_events?";

const Wallet = new WalletResolver();

const mockDB = async () => {
  try {
    await Wallet.createOrUpdateWallet(
      {
        address: wallet.address
      },
      context
    );
  } catch (e) {
    console.log(e);
  }
};

const contractEventFilter = (indexer: Indexer) => (event: StarkNetEvent) =>
  event.contract === indexer.contract &&
  event.block_number > indexer.getLastBlockIndexed();

class StarkNetIndexer {
  indexers: Array<Indexer>;

  constructor(context: Context) {
    this.indexers = [new DesiegeIndexer(context)];
  }

  async init() {
    for (let indexer of this.indexers) {
      await indexer.init();
    }
  }

  async pollEvents() {
    const contracts = this.indexers
      .map((indexer) => indexer.contract)
      .join(",");
    const blockNumber = Math.min(
      ...this.indexers.map((indexer) => indexer.getLastBlockIndexed())
    );

    const desiegeQuery: string =
      StarkNetUrl + contract(contracts) + fromBlock(blockNumber);
    const response = await fetch(desiegeQuery);

    try {
      const { items }: StarkNetResponse = await response.json();
      for (let indexer of this.indexers) {
        await indexer.updateIndex(items.filter(contractEventFilter(indexer)));
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export const StarkNet = () => {
  return {
    async serverWillStart() {
      await mockDB;

      const indexer = new StarkNetIndexer(context);
      await indexer.init();
      setInterval(async () => {
        await indexer.pollEvents();
      }, 5000);
    }
  };
};
