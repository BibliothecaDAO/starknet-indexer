import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";

const CONTRACT =
  "0x02d73a83afeaf5927c2dfb51b2412ea9dfe1fb6cd41b1b702607e7345ce47d09";

export default class FoodIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("Created", this.onCreated.bind(this));
    this.on("Harvest", this.onHarvest.bind(this));
    this.on("Harvest_2", this.onHarvest_2.bind(this));
  }

  async onCreated(event: Event): Promise<void> {
    const eventId = event.eventId;
    const params = event.parameters ?? [];
    const realmId = parseInt(params[0]);
    const buildingId = parseInt(params[2]);

    const qty = parseInt(params[3]) || 0;
    const harvests = parseInt(params[4]) || 0;
    const createdAt = new Date(parseInt(params[5]) * 1000);

    const where = {
      realmId_buildingId: { realmId, buildingId }
    };

    await this.context.prisma.food.upsert({
      where,
      create: {
        realmId,
        eventId,
        buildingId,
        qty,
        harvests,
        createdAt,
        updatedAt: createdAt
      },
      update: {
        eventId,
        qty,
        harvests,
        createdAt,
        updatedAt: createdAt
      }
    });
  }

  async onHarvest(event: Event) {
    this.onHarvest_2(event);
  }

  async onHarvest_2(event: Event) {
    const params = event.parameters ?? [];
    const realmId = parseInt(params[0]);
    const buildingId = parseInt(params[2]);
    const harvests = parseInt(params[3]) || 0;
    const updatedAt = params[4]
      ? new Date(parseInt(params[4]) * 1000)
      : event.timestamp;
    try {
      const where = {
        realmId_buildingId: { realmId, buildingId }
      };

      await this.context.prisma.food.upsert({
        where,
        create: {
          realmId,
          eventId: event.eventId,
          buildingId,
          qty: 1,
          harvests,
          createdAt: updatedAt,
          updatedAt
        },
        update: {
          harvests,
          updatedAt
        }
      });
    } catch (e) {
      console.log("Food harvest error", event.eventId);
      console.log(e);
    }
  }
}
