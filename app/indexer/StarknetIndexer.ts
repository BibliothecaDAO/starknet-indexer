import { Event } from "./../entities/starknet/Event";
import { Context } from "./../context";
import { Indexer, StarkNetEvent } from "./../types";
// import StarknetVoyagerApi from "./StarknetVoyagerApi";
import StarknetRpcProvider from "./StarknetRpcProvider";
import { NETWORK } from "./../utils/constants";

export default class StarknetIndexer implements Indexer<StarkNetEvent> {
  indexers: Indexer<Event>[];
  context: Context;
  isSyncing: boolean;

  provider: StarknetRpcProvider;
  interval: NodeJS.Timer;
  currentBlockNumber: number = 0;

  constructor(indexers: Indexer<Event>[], context: Context) {
    this.indexers = indexers;
    this.context = context;
    this.provider = new StarknetRpcProvider();
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
            txHash: event.transactionHash ?? ""
          }
        })
      );
    }
    if (upserts.length > 0) {
      await this.context.prisma.$transaction(upserts);
    }
    return;
  }

  async indexContract(contract: string) {
    const indexer = this.findIndexer(contract);
    if (!indexer) {
      return;
    }
    let lastEventIndexed = (await indexer?.lastEventId()) ?? "";
    let lastBlockNumber = (await indexer?.lastBlockNumber()) ?? 0;

    let fetchMore = true;
    let page = 0;
    const eventCounts: any = {};

    do {
      const resp = await this.provider.getEvents({
        address: contract,
        page_number: page,
        page_size: 100,
        fromBlock: lastBlockNumber
      });
      if (!resp) {
        return;
      }

      let results: StarkNetEvent[] = [];
      for (let i = 0; i < resp.events.length; i++) {
        const event = resp.events[i];

        const blockNumber = event.block_number;
        const transactionHash = event.transaction_hash;
        const block = await this.provider.getBlockByNumber(blockNumber);
        if (!block) {
          // TODO: handle error
          console.error("block not found", event.block_number);
          return;
        }

        const transaction = await this.provider.getTransactionByHash(
          transactionHash
        );

        if (!transaction) {
          // TODO: handle error
          console.error("transaction not found", transactionHash);
          return;
        }

        let transactionNumber = block.transactions.indexOf(transactionHash);
        if (transactionNumber < 0) {
          // TODO: handle error
          console.error("transaction number found", transactionHash);
          return;
        }
        const toAddress = transaction.contract_address;
        const eventKey = `${event.block_number}_${String(
          transactionNumber
        ).padStart(4, "0")}`;

        if (!eventCounts[eventKey]) {
          eventCounts[eventKey] = 0;
        }

        // blockNumber_transactionNumber_eventCount_contractAddress
        const eventId = `${eventKey}_${String(eventCounts[eventKey]).padStart(
          4,
          "0"
        )}_${contract}`;
        eventCounts[eventKey]++;
        const timestamp = new Date(block.accepted_time * 1000);
        const name = event.keys
          ? (indexer as any).eventName(event.keys[0])
          : "";

        if (eventId > lastEventIndexed) {
          results.push({
            chainId: NETWORK,
            eventId,
            name,
            contract,
            blockNumber,
            transactionNumber,
            transactionHash,
            toAddress,
            timestamp,
            keys: event.keys ?? [],
            parameters: event.data ?? [],
            status: 1
          });
        }
      }

      fetchMore = resp.is_last_page === false;
      await this.index(results);
      page++;
    } while (fetchMore);
  }

  async syncEvents() {
    for (let contract of this.contracts()) {
      await this.indexContract(contract);
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

    const blockNumber = await this.provider.blockNumber();
    if (this.currentBlockNumber === blockNumber) {
      console.info("no new blocks");
      return;
    }

    this.isSyncing = true;
    await this.syncEvents();
    await this.syncIndexers();
    this.currentBlockNumber = await this.provider.blockNumber();
    this.isSyncing = false;
  }

  async start() {
    this.interval = setInterval(this.sync.bind(this), 10 * 1000);
  }

  async stop() {
    clearInterval(this.interval);
  }

  async lastEventId(): Promise<string> {
    const event = await this.context.prisma.event.findFirst({
      orderBy: { eventId: "desc" }
    });
    if (event) {
      return event.eventId;
    }
    return "";
  }

  async lastBlockNumber(): Promise<number> {
    const event = await this.context.prisma.event.findFirst({
      orderBy: { eventId: "desc" }
    });
    if (event) {
      return event.blockNumber;
    }
    return 0;
  }
}
