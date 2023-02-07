import { Event } from "./../entities/starknet/Event";
import { Context } from "./../context";
import { Indexer, StarkNetEvent } from "./../types";
// import StarknetVoyagerApi from "./StarknetVoyagerApi";
import StarknetRpcProvider from "./StarknetRpcProvider";
import { NETWORK } from "./../utils/constants";
import { BigNumber } from "ethers";

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
        keys: event.keys,
        blockNumber: event.blockNumber,
        transactionNumber: event.transactionNumber,
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
          },
        })
      );
    }

    if (upserts.length > 0) {
      await Promise.all(upserts);
      // await this.context.prisma.$transaction(upserts);
    }
    return;
  }

  async indexContract(contract: string) {
    const indexer = this.findIndexer(contract);
    if (!indexer) {
      return;
    }
    const lastEvent = await this.context.prisma.event.findFirst({
      where: { contract, status: { gt: 0 } },
      orderBy: { eventId: "desc" },
    });
    let lastEventIndexed = lastEvent?.eventId ?? "";
    let lastBlockNumber = (lastEvent?.blockNumber ?? 0) + 1;

    let continuation_token = undefined;

    do {
      const resp: any = await this.provider.getEvents({
        address: contract,
        continuation_token,
        chunk_size: 500,
        from_block: {
          block_number: lastBlockNumber,
        },
      });
      if (!resp) {
        console.error("Error requesting events. Empty results.");
        return;
      }
      continuation_token = resp.continuation_token;

      const blockNumbers = {} as any;

      const txHashes = resp.events
        .map((event: any) => {
          blockNumbers[event.transaction_hash] = event.block_number;
          return event.transaction_hash;
        })
        .filter((value: any, index: number, self: any) => {
          return self.indexOf(value) === index;
        });

      let results: StarkNetEvent[] = [];

      for (let transactionHash of txHashes) {
        const receipt = await this.provider.getTransactionReceipt(
          transactionHash
        );
        if (!receipt) {
          return;
        }

        if (!receipt.events || receipt.events.length === 0) {
          continue;
        }

        for (let eventIdx = 0; eventIdx < receipt.events.length; eventIdx++) {
          const event = receipt.events[eventIdx];
          if (
            BigNumber.from(event.from_address).toHexString() !==
            BigNumber.from(contract).toHexString()
          ) {
            continue;
          }

          const blockNumber = blockNumbers[transactionHash];
          const block = await this.provider.getBlockWithTxHashes({
            block_number: blockNumber,
          });
          if (!block) {
            // TODO: handle error
            console.error("block not found", blockNumber);
            return;
          }

          let transactionNumber = block.transactions.indexOf(transactionHash);
          if (transactionNumber < 0) {
            // TODO: handle error
            console.error("transaction number not found", transactionHash);
            return;
          }

          const eventId = `${blockNumber}_${String(transactionNumber).padStart(
            4,
            "0"
          )}_${String(eventIdx).padStart(4, "0")}`;

          const timestamp = new Date(block.timestamp * 1000);
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
              timestamp,
              keys: event.keys ?? [],
              parameters: event.data ?? [],
              status: 1,
            });
          }
        }
      }

      await this.index(results);
    } while (continuation_token);
  }

  async syncAllEvents() {
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
    console.info("query events to index");
    const events = await this.context.prisma.event.findMany({
      where: { status: 1 },
      orderBy: { eventId: "asc" },
      take: 1000,
    });
    console.info("indexing", events.length, "events");
    for (let event of events) {
      const indexer = this.findIndexer(event.contract);
      if (indexer) {
        await indexer.index([event]);
      }
    }
  }

  async sync() {
    if (this.isSyncing) {
      return;
    }

    try {
      this.isSyncing = true;
      const blockNumber = await this.provider.blockNumber();
      if (this.currentBlockNumber < blockNumber) {
        console.info(
          "syncing events from starknet started",
          this.currentBlockNumber
        );
        await this.syncAllEvents();
        console.info("syncing events from starknet complete", blockNumber);
        this.currentBlockNumber = blockNumber;
      } else {
        console.info("no new blocks");
      }

      await this.syncIndexers();
      this.isSyncing = false;
    } catch (e) {
      console.log(e);
      this.isSyncing = false;
    }
  }

  async start() {
    this.interval = setInterval(this.sync.bind(this), 5 * 1000);
  }

  async stop() {
    clearInterval(this.interval);
  }

  async lastEventId(): Promise<string> {
    const event = await this.context.prisma.event.findFirst({
      orderBy: { eventId: "desc" },
    });
    if (event) {
      return event.eventId;
    }
    return "";
  }

  async lastBlockNumber(): Promise<number> {
    const event = await this.context.prisma.event.findFirst({
      orderBy: { eventId: "desc" },
    });
    if (event) {
      return event.blockNumber;
    }
    return 0;
  }
}
