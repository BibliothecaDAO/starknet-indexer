import { StarkNetEvent, StarkNetResponse } from "../types";
import StarknetApi from "./StarknetApi";
import { Context, context } from "../context";

import { WalletResolver } from "../resolvers";
import { wallet } from "../db/testDB";
import { Indexer } from "../types";
import DesiegeIndexer from "./DesiegeIndexer";

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
    console.error(e);
  }
};

const contractEventFilter =
  (indexer: Indexer, lastIndexedBlock: number) => (event: StarkNetEvent) =>
    event.contract &&
    indexer.getContracts().includes(event.contract) &&
    event.block_number > lastIndexedBlock;

class StarkNetIndexer implements Indexer {
  indexers: Array<Indexer>;
  isPolling: Boolean;
  interval: NodeJS.Timer;

  constructor(context: Context) {
    this.indexers = [new DesiegeIndexer(context)];
    this.isPolling = false;
  }

  getContracts(): string[] {
    return this.indexers.map((indexer) => indexer.getContracts()).flat();
  }

  async updateIndex(events: StarkNetEvent[]): Promise<void> {
    for (let indexer of this.indexers) {
      const lastIndexedBlock = await indexer.getLastBlockIndexed();
      await indexer.updateIndex(
        events.filter(contractEventFilter(indexer, lastIndexedBlock))
      );
    }
  }

  async getLastBlockIndexed(): Promise<number> {
    const lastBlocksIndexed = await Promise.all(
      this.indexers.map((indexer) => indexer.getLastBlockIndexed())
    );
    return Math.min(...lastBlocksIndexed);
  }

  async pollEvents() {
    if (this.isPolling) {
      return;
    }

    this.isPolling = true;
    const size = 100;
    const minLastBlockIndexed = await this.getLastBlockIndexed();
    const blockNumber = minLastBlockIndexed + 1;

    let events: StarkNetEvent[] = [];
    try {
      let response: StarkNetResponse = await StarknetApi()
        .contract(this.getContracts())
        .fromBlock(blockNumber)
        .size(size)
        .fetch();

      if (!response.items) {
        this.isPolling = false;
        return;
      }
      events = response.items;
    } catch (e) {
      console.error(e);
    }

    // Sync remainder of last block
    if (events.length === size) {
      const lastBlockFound = events[events.length - 1].block_number;
      let lastBlockEvents: StarkNetEvent[] = [];
      let page = 1;
      let searchMore = true;
      do {
        try {
          let response: StarkNetResponse = await StarknetApi()
            .contract(this.getContracts())
            .fromBlock(lastBlockFound)
            .toBlock(lastBlockFound)
            .size(size)
            .page(page)
            .fetch();
          page++;
          if (response.items) {
            lastBlockEvents = [...lastBlockEvents, ...response.items];
            searchMore = response.total === size;
          } else {
            searchMore = false;
          }
        } catch (e) {
          //TODO: Potential edge case if API goes down here
          searchMore = false;
        }
      } while (searchMore);

      events = [
        ...events.filter((event) => event.block_number !== lastBlockFound),
        ...lastBlockEvents
      ];
    }

    this.updateIndex(events);
    this.isPolling = false;
  }

  start() {
    this.interval = setInterval(this.pollEvents.bind(this), 5000);
  }

  stop() {
    clearInterval(this.interval);
  }
}

export const StarkNet = () => {
  return {
    async serverWillStart() {
      await mockDB;

      const indexer = new StarkNetIndexer(context);
      indexer.start();
    }
  };
};
