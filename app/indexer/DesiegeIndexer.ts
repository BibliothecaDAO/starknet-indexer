// import { DesiegeResolver } from "../resolvers";
import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer } from "./../types";

export default class DesiegeIndexer implements Indexer<Event> {
  private CONTRACTS = [
    "0x40098a0012c879cf85e0909ca10108197d9bf3970e6c2188641697f49aca134",
    "0x1fbec91116c1ced6bb392502adc191dd7978f2b066c674bf28f8710a9a52afd"
  ];
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  contracts(): string[] {
    return this.CONTRACTS;
  }

  async index(events: Event[]): Promise<void> {
    let lastIndexedEventId = await this.lastIndexId();
    for (const event of events) {
      const eventId = event.eventId;
      if (eventId <= lastIndexedEventId) {
        continue;
      }
      const params = (event.parameters as any) ?? [];
      const isGameAction = params.length === 5;

      const tokenOffset = isGameAction ? params[2] : 0;
      const tokenAmount = isGameAction ? params[3] : 0;
      // const actionType = isGameAction ? params[4] : 0;
      const attackedTokens = tokenOffset === 1 ? tokenAmount : 0;
      const defendedTokens = tokenOffset === 2 ? tokenAmount : 0;
      const winner = 0;
      await this.context.prisma.desiege.upsert({
        where: {
          gameId: params[0]
        },
        update: {
          attackedTokens: { increment: attackedTokens },
          defendedTokens: { increment: defendedTokens },
          eventIndexed: event.eventId,
          winner,
          startedOn: !isGameAction ? event.timestamp : undefined,
          initialHealth: !isGameAction ? params[1] : undefined
        },
        create: {
          gameId: params[0],
          attackedTokens,
          defendedTokens,
          eventIndexed: event.eventId,
          winner,
          startedOn: !isGameAction ? event.timestamp : new Date(0),
          initialHealth: !isGameAction ? params[1] : undefined
        }
      });

      lastIndexedEventId = event.eventId;
    }
    return;
  }

  async lastIndexId(): Promise<number> {
    const desiege = await this.context.prisma.desiege.findFirst({
      orderBy: {
        eventIndexed: "desc"
      }
    });
    return desiege?.eventIndexed ?? 0;
  }
}
