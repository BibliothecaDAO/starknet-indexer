import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer, StarkNetEvent } from "./../types";
import StarknetVoyagerApi from "./StarknetVoyagerApi";

export default class StarknetIndexer implements Indexer<StarkNetEvent> {
  indexers: Indexer<Event>[];
  context: Context;
  isSyncing: boolean;

  voyager: StarknetVoyagerApi;
  interval: NodeJS.Timer;

  constructor(indexers: Indexer<Event>[], context: Context) {
    this.indexers = indexers;
    this.context = context;
    this.voyager = new StarknetVoyagerApi();
  }

  contracts(): string[] {
    return this.indexers.map((indexer) => indexer.contracts()).flat();
  }

  async index(events: StarkNetEvent[]): Promise<void> {
    for (let event of events) {
      const updates: any = {
        chainId: event.chain_id ?? "testnet",
        contract: event.contract,
        name: event.name,
        parameters: event.parameters
      };

      if (event.timestamp) {
        updates.timestamp = event.timestamp;
      }

      await this.context.prisma.event.upsert({
        where: { eventId: event.event_id },
        update: { ...updates, status: event.status },
        create: {
          ...updates,
          eventId: event.event_id as number,
          name: event.name ?? "",
          timestamp: event.timestamp ?? new Date(0),
          txHash: event.tx_hash ?? ""
        }
      });
    }
    return;
  }

  async indexContract(contract: string, lastEventIndexed: number) {
    let fetchMore = true;
    let page = 1;

    do {
      const data = await this.voyager.fetch({ contract, page });
      const pageSize = 50;
      let results: StarkNetEvent[] = [];
      if (data.items) {
        results = data.items
          .filter((item) => item.id > lastEventIndexed)
          .map((item) => {
            return {
              event_id: item.id,
              block_number: 0,
              contract,
              tx_hash: item.transactionHash,
              status: 0
            };
          });
      }

      fetchMore = data.hasMore && results.length === pageSize;
      await this.index(results);
      page++;
    } while (fetchMore);
  }

  async syncEvents() {
    const lastSynced = await this.lastIndexId();
    for (let contract of this.contracts()) {
      await this.indexContract(contract, lastSynced);
    }
  }

  async syncEventDetails() {
    const events = await this.context.prisma.event.findMany({
      take: 50,
      where: {
        status: 0
      },
      orderBy: {
        eventId: "asc"
      }
    });

    const batchSize = 3;
    try {
      for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize).map((event) =>
          this.voyager
            .fetchEventDetails({
              id: event.eventId,
              transactionHash: event.txHash,
              contract: event.contract
            })
            .catch((e) => {
              console.error(
                `Sync contract ${event.contract} event: ${event.eventId} failed`,
                e
              );
              return {
                name: "",
                event_id: event.eventId,
                chain_id: "testnet",
                contract: event.contract,
                tx_hash: event.txHash,
                timestamp: undefined,
                parameters: []
              };
            })
        );
        const results = await Promise.all(batch);
        await this.index(
          results.map((result) => ({
            ...result,
            status: result.parameters && result.parameters.length > 0 ? 1 : -1
          }))
        );
      }
    } catch (e) {}
  }

  async syncIndexers() {
    for (let indexer of this.indexers) {
      const lastId = await indexer.lastIndexId();
      const contracts = indexer.contracts();
      const events = await this.context.prisma.event.findMany({
        where: {
          eventId: {
            gt: lastId
          },
          contract: {
            in: contracts
          },
          status: 1
        },
        orderBy: {
          eventId: "asc"
        }
      });
      await indexer.index(events);
    }
  }

  async sync() {
    if (this.isSyncing) {
      return;
    }
    this.isSyncing = true;
    await this.syncEvents();
    await this.syncEventDetails();
    await this.syncIndexers();
    this.isSyncing = false;
  }

  async start() {
    this.interval = setInterval(this.sync.bind(this), 5000);
  }

  async stop() {
    clearInterval(this.interval);
  }

  async lastIndexId(): Promise<number> {
    const event = await this.context.prisma.event.findFirst({
      orderBy: { eventId: "desc" }
    });
    if (event) {
      return event.eventId;
    }
    return 0;
  }
}
