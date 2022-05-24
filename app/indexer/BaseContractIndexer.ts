import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer } from "./../types";
import { BigNumber } from "ethers";
import { hash } from "starknet";

type ContractEventHandler = {
  name: string;
  handle: (event: Event) => Promise<void>;
};

function selectorHash(selector: string) {
  return BigNumber.from(selector).toHexString();
}

export default class BaseContractIndexer implements Indexer<Event> {
  protected context: Context;
  protected addresses: string[];
  private handlers: { [select: string]: ContractEventHandler };

  constructor(context: Context, address: string) {
    this.context = context;
    this.handlers = {};
    this.addresses = [address];
  }

  contracts(): string[] {
    return this.addresses;
  }

  addHandler(name: string, handler: (event: Event) => Promise<void>) {
    this.handlers[selectorHash(hash.getSelectorFromName(name))] = {
      name,
      handle: handler
    };
  }

  eventName(selector: string): string {
    return this.handlers[selectorHash(selector)]?.name ?? "";
  }

  async index(events: Event[]): Promise<void> {
    try {
      let lastIndexedEventId = await this.lastIndexId();
      for (const event of events) {
        const eventId = event.eventId;
        if (eventId <= lastIndexedEventId) {
          continue;
        }
        const handlerObject = this.handlers[selectorHash(event.keys[0])];
        if (handlerObject) {
          await handlerObject.handle(event);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return;
  }

  async lastIndexId(): Promise<string> {
    const event = await this.context.prisma.event.findFirst({
      where: {
        contract: { in: this.contracts() },
        status: 2
      },
      orderBy: {
        eventId: "desc"
      }
    });
    return event?.eventId ?? "";
  }
}
