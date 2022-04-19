// import { DesiegeResolver } from "../resolvers";
import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer } from "./../types";

export default class LoreIndexer implements Indexer<Event> {
  private CONTRACTS = [
    "0x521151a3e28d2efff7d7d34c4f8bbe45c4c9f37424bae4dc63836fd659c51e6"
  ];
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  contracts(): string[] {
    return this.CONTRACTS;
  }

  async index(events: Event[]): Promise<void> {
    for (const event of events) {
      console.log(event)
    }
    return;
  }

  async lastIndexId(): Promise<number> {
    return 0; // desiege?.eventIndexed ?? 0;
  }
}
