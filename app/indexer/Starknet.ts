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

const contractEventFilter =
  (indexer: Indexer, lastIndexedBlock: number) => (event: StarkNetEvent) =>
    event.contract &&
    indexer.contracts.includes(event.contract) &&
    event.block_number > lastIndexedBlock;

class StarkNetIndexer {
  indexers: Array<Indexer>;

  constructor(context: Context) {
    this.indexers = [new DesiegeIndexer(context)];
  }

  async pollEvents() {
    const contracts = this.indexers
      .map((indexer) => indexer.contracts)
      .flat()
      .map((address) => contract(address))
      .join("");
    const lastBlocksIndexed = await Promise.all(
      this.indexers.map((indexer) => indexer.getLastBlockIndexed())
    );
    const blockNumber = Math.min(...lastBlocksIndexed) + 1;
    const desiegeQuery: string =
      StarkNetUrl + contracts + fromBlock(blockNumber);

    try {
      const response = await fetch(desiegeQuery);
      const result: StarkNetResponse = await response.json();
      if (!result.items) {
        return;
      }
      for (let indexer of this.indexers) {
        const lastIndexedBlock = await indexer.getLastBlockIndexed();
        await indexer.updateIndex(
          result.items.filter(contractEventFilter(indexer, lastIndexedBlock))
        );
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
      setInterval(async () => {
        await indexer.pollEvents();
      }, 5000);
    }
  };
};
