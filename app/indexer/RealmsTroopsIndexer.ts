import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer } from "../types";
import { BigNumber } from "ethers";
import { hash } from "starknet";

const BUILD_TROOPS_SELECTOR = BigNumber.from(
  hash.getSelectorFromName("Build_toops")
).toHexString();

export default class RealmsTroopsIndexer implements Indexer<Event> {
  private CONTRACTS = [
    "0x0143c2b110961626f46c4b35c55fa565227ffdb803155e917df790bad29240b9"
  ];
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  contracts(): string[] {
    return this.CONTRACTS;
  }

  isBuildTroops(keys: string[]) {
    if (keys?.length !== 1) {
      return false;
    }
    return BigNumber.from(keys[0]).toHexString() === BUILD_TROOPS_SELECTOR;
  }

  eventName(selector: string): string {
    const eventSelector = BigNumber.from(selector).toHexString();
    switch (eventSelector) {
      case BUILD_TROOPS_SELECTOR:
        return "Build_toops";
      default:
        return "";
    }
  }

  async index(events: Event[]): Promise<void> {
    let lastIndexedEventId = await this.lastIndexId();
    for (const event of events) {
      const eventId = event.eventId;
      if (eventId <= lastIndexedEventId) {
        continue;
      }
      const params = event.parameters ?? [];
      const keys = event.keys ?? [];
      let realmId = 0;
      if (this.isBuildTroops(keys)) {
        try {
          const troopsLen = parseInt(params[0]);
          const troops = params.slice(1, troopsLen + 1);
          realmId = parseInt(params[troopsLen + 1]);
          const isAttack = params[params.length - 1] === "1";
          const data = {} as any;
          if (isAttack) {
            data.attackTroopIds = [...troops];
          } else {
            data.defendTroopIds = [...troops];
          }

          await this.context.prisma.realm.update({
            where: { realmId },
            data
          });
        } catch (e) {
          console.error(
            `Invalid troops upgrade: realmId: ${realmId} Event: ${event.eventId}, Params: `,
            JSON.stringify(params)
          );
        }
      }
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
