import { Event } from "./../entities/starknet/Event";
import { Context } from "./../context";
import { Indexer, StarkNetEvent } from "./../types";
import StarknetVoyagerApi from "./StarknetVoyagerApi";
import { NETWORK } from "./../utils/constants";

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
    const upserts = [];
    for (let event of events) {
      const updates: any = {
        chainId: event.chainId ?? NETWORK,
        contract: event.contract,
        name: event.name,
        parameters: event.parameters,
        toAddress: event.toAddress,
        keys: event.keys,
        blockNumber: event.blockNumber,
        transactionNumber: event.transactionNumber
      };

      if (event.timestamp) {
        updates.timestamp = event.timestamp;
      }
      if (event.status) {
        updates.status = event.status;
      }

      upserts.push(
        this.context.prisma.event.upsert({
          where: { eventId: event.eventId },
          update: { ...updates },
          create: {
            ...updates,
            eventId: event.eventId,
            name: event.name ?? "",
            timestamp: event.timestamp ?? new Date(0),
            txHash: event.transactionHash ?? "",
            status: 0
          }
        })
      );
    }
    if (upserts.length > 0) {
      await this.context.prisma.$transaction(upserts);
    }
    return;
  }

  async indexContract(contract: string, lastEventIndexed: string) {
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
              eventId: item.id,
              contract,
              blockNumber: item.block_number,
              transactionNumber: item.transaction_number,
              transactionHash: item.transactionHash
            };
          });
      }
      fetchMore = data.hasMore && results.length === pageSize;
      await this.index(results);
      page++;
    } while (fetchMore);
  }

  async syncEvents() {
    let lastSynced = await this.lastIndexId();
    for (let contract of this.contracts()) {
      const indexer = this.findIndexer(contract);
      lastSynced = (await indexer?.lastIndexId()) ?? lastSynced;
      await this.indexContract(contract, lastSynced);
    }
  }

  findIndexer(contract: string) {
    if (!contract) {
      return null;
    }
    return this.indexers.find((indexer) => {
      return indexer.contracts().indexOf(contract) > -1;
    });
  }

  async syncEventDetails() {
    const events = await this.context.prisma.event.findMany({
      take: 50,
      where: { status: 0 },
      orderBy: { eventId: "asc" }
    });
    try {
      let results: StarkNetEvent[] = [];
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        results.push(
          await this.voyager.fetchEventDetails({
            id: event.eventId,
            transactionHash: event.txHash,
            block_number: event.blockNumber,
            transaction_number: event.transactionNumber,
            contract: event.contract
          })
        );
      }
      await this.index(
        results.map((result) => {
          const indexer = this.findIndexer(result.contract!);
          let eventName = "";
          if (indexer && indexer.eventName && result.keys) {
            eventName = result.keys[0] ? indexer.eventName(result.keys[0]) : "";
          }
          return {
            ...result,
            name: eventName,
            status: result.parameters && result.parameters.length > 0 ? 1 : -1
          };
        })
      );
      this.voyager.purgeCache();
    } catch (e) {
      // wait for voyager
      console.error(e);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  async syncIndexers() {
    for (let indexer of this.indexers) {
      const contracts = indexer.contracts();
      const events = await this.context.prisma.event.findMany({
        where: {
          contract: { in: contracts },
          status: 1
        },
        orderBy: { eventId: "asc" }
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

  async lastIndexId(): Promise<string> {
    const event = await this.context.prisma.event.findFirst({
      orderBy: { eventId: "desc" }
    });
    if (event) {
      return event.eventId;
    }
    return "";
  }
}
