import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer } from "./../types";
import { BigNumber } from "ethers";
import { hash } from "starknet";
import { ResourceType } from "@prisma/client";

const RESOURCE_UPGRADED_SELECTOR = BigNumber.from(
  hash.getSelectorFromName("ResourceUpgraded")
).toHexString();

const RESOURCES = [
  ResourceType.Wood,
  ResourceType.Stone,
  ResourceType.Coal,
  ResourceType.Copper,
  ResourceType.Obsidian,
  ResourceType.Silver,
  ResourceType.Ironwood,
  ResourceType.Cold_Iron,
  ResourceType.Gold,
  ResourceType.Hartwood,
  ResourceType.Diamonds,
  ResourceType.Sapphire,
  ResourceType.Ruby,
  ResourceType.Deep_Crystal,
  ResourceType.Ignium,
  ResourceType.Ethereal_Silica,
  ResourceType.True_Ice,
  ResourceType.Twilight_Quartz,
  ResourceType.Alchemical_Silver,
  ResourceType.Adamantine,
  ResourceType.Mithral,
  ResourceType.Dragonhide
];

export default class RealmsResourceIndexer implements Indexer<Event> {
  private CONTRACTS = [
    "0x04a29535b95b85aca744a0b1bcc2faa1972f0769db1ec10780bb7c01ce3fe8fd"
  ];
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  contracts(): string[] {
    return this.CONTRACTS;
  }

  isResourceUpgradedEvent(keys: string[]) {
    if (keys?.length !== 1) {
      return false;
    }
    return BigNumber.from(keys[0]).toHexString() === RESOURCE_UPGRADED_SELECTOR;
  }

  eventName(selector: string): string {
    const eventSelector = BigNumber.from(selector).toHexString();
    switch (eventSelector) {
      case RESOURCE_UPGRADED_SELECTOR:
        return "ResourceUpgraded";
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
      let resourceId = 0;
      let where = {};
      if (this.isResourceUpgradedEvent(keys)) {
        let resource;
        try {
          resourceId = parseInt(params[2]) - 1;
          where = {
            type_realmId: {
              realmId: parseInt(params[0]),
              type: RESOURCES[resourceId]
            }
          };
          resource = await this.context.prisma.resource.findUnique({
            where
          });
        } catch (e) {
          console.error(
            `Invalid resource upgrade: Event: ${event.eventId}, Params: `,
            JSON.stringify(params)
          );
        }

        if (resource) {
          let upgrades = resource.upgrades ?? [];
          const timestamp = event.timestamp.toISOString();
          if (upgrades.indexOf(timestamp) === -1) {
            upgrades.push(timestamp);
          }
          await this.context.prisma.resource.update({
            where,
            data: {
              level: parseInt(params[3]),
              upgrades: [...upgrades]
            }
          });
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
