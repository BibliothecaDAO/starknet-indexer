import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer } from "./../types";
import { BigNumber } from "ethers";
import { hash } from "starknet";

// Events
const GAME_STARTED_SELECTOR = BigNumber.from(
  hash.getSelectorFromName("game_started")
).toHexString();

const GAME_ACTION_SELECTOR = BigNumber.from(
  hash.getSelectorFromName("game_action")
).toHexString();

export default class DesiegeIndexer implements Indexer<Event> {
  private CONTRACTS = [
    "0x61756c424c781388f8908e02c97e31574a0fed80a9561fa025fb74140f79470"
  ];
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  contracts(): string[] {
    return this.CONTRACTS;
  }

  eventName(selector: string): string {
    const eventSelector = BigNumber.from(selector).toHexString();
    switch (eventSelector) {
      case GAME_STARTED_SELECTOR:
        return "game_started";
      case GAME_ACTION_SELECTOR:
        return "game_action";
      default:
        return "";
    }
  }

  async index(events: Event[]): Promise<void> {
    try {
      let lastIndexedEventId = await this.lastIndexId();
      for (const event of events) {
        const eventId = event.eventId;
        if (eventId <= lastIndexedEventId) {
          continue;
        }
        const params = event.parameters ?? [];
        const isGameAction = params.length === 5;

        const tokenOffset = isGameAction ? parseInt(params[2]) : 0;
        const tokenAmount = isGameAction ? parseInt(params[3]) : 0;
        // const actionType = isGameAction ? params[4] : 0;
        const attackedTokens = tokenOffset === 1 ? tokenAmount : 0;
        const defendedTokens = tokenOffset === 2 ? tokenAmount : 0;
        const winner = 0;
        await this.context.prisma.desiege.upsert({
          where: {
            gameId: parseInt(params[0])
          },
          update: {
            attackedTokens: { increment: attackedTokens },
            defendedTokens: { increment: defendedTokens },
            eventIndexed: event.eventId,
            winner,
            startedOn: !isGameAction ? event.timestamp : undefined,
            initialHealth: !isGameAction ? parseInt(params[1]) : undefined
          },
          create: {
            gameId: parseInt(params[0]),
            attackedTokens,
            defendedTokens,
            eventIndexed: event.eventId,
            winner,
            startedOn: !isGameAction ? event.timestamp : new Date(0),
            initialHealth: !isGameAction ? parseInt(params[1]) : undefined
          }
        });

        lastIndexedEventId = event.eventId;
      }
    } catch (e) {
      console.log(e);
    }
    return;
  }

  async lastIndexId(): Promise<string> {
    const desiege = await this.context.prisma.desiege.findFirst({
      orderBy: {
        eventIndexed: "desc"
      }
    });
    return desiege?.eventIndexed ?? "";
  }
}
