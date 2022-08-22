import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";

const CONTRACT =
  "0x03a34ef38f402d6b66b681db7905edfc48676288a7b08cd79910737c45431093";

export default class FoodIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("Created", this.onCreated.bind(this));
    this.on("Integrity", this.onHarvest.bind(this));
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
        createdAt
      },
      update: {
        eventId,
        qty,
        harvests,
        createdAt
      }
    });
  }

  async onHarvest(event: Event) {
    const params = event.parameters ?? [];
    const realmId = parseInt(params[0]);
    const buildingId = parseInt(params[2]);

    const harvests = parseInt(params[3]) || 0;

    const where = {
      realmId_buildingId: { realmId, buildingId }
    };

    await this.context.prisma.food.update({
      where,
      data: { harvests }
    });
  }
}
