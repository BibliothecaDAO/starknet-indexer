import { Prisma } from "@prisma/client";
import { Context } from "../context";
import { Indexer, StarkNetEvent } from "./../types";
import StarknetVoyagerApi from "./StarknetVoyagerApi";

export default class StarknetIndexer implements Indexer {
  indexers: Indexer[];
  context: Context;
  isInitialized: boolean;
  voyager: StarknetVoyagerApi;

  constructor(indexers: Indexer[], context: Context) {
    this.indexers = indexers;
    this.context = context;
    this.voyager = new StarknetVoyagerApi();
  }

  contracts(): string[] {
    return this.indexers.map((indexer) => indexer.contracts()).flat();
  }

  async index(events: StarkNetEvent[]): Promise<void> {
    for (let event of events) {
      const updates = {
        blockNumber: event.block_number ?? 0,
        chainId: event.chain_id ?? "testnet",
        contract: event.contract ?? "",
        name: event.name ?? "",
        parameters: (event.parameters ?? []) as Prisma.JsonArray,
        timestamp: event.timestamp ?? new Date(),
        txHash: event.tx_hash ?? ""
      };
      await this.context.prisma.event.upsert({
        where: { eventId: event.event_id },
        update: { ...updates },
        create: { eventId: event.event_id as number, ...updates }
      });
    }
    return;
  }

  async start() {
    const contracts = this.contracts();
    const contract = contracts[0];

    let fetchMore = true;
    let page = 1;
    do {
      const data = await this.voyager.fetch({ contract, page });
      page++;

      const results: StarkNetEvent[] = [];
      console.log(data.items.length, " of items");
      const batchSize = 5;
      for (let i = 0; i < data.items.length; i += batchSize) {
        const batch = data.items
          .slice(i, i + batchSize)
          .map((event) => this.voyager.fetchEventDetails(event));
        results.push(...(await Promise.all(batch)));
      }
      fetchMore = data.hasMore;
      await this.index(results);
    } while (fetchMore);
  }

  async stop() {}

  async getLastSyncedId(): Promise<number> {
    const event = await this.context.prisma.event.findFirst({
      orderBy: {
        eventId: "desc"
      }
    });
    if (event) {
      return event.eventId;
    }
    return 0;
  }
}
