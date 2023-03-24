import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { BuildingNameById } from "./../../utils/game_constants";

const CONTRACT =
  "0x070548b78f808b68a5372b78dae2dc2570e1691fbf474bd3359d2c7731f2f901";

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
      realmId_buildingId: { realmId, buildingId },
    };

    await Promise.all([
      this.context.prisma.food.upsert({
        where,
        create: {
          realmId,
          eventId,
          buildingId,
          qty,
          harvests,
          createdAt,
          updatedAt: createdAt,
        },
        update: {
          eventId,
          qty,
          harvests,
          createdAt,
          updatedAt: createdAt,
        },
      }),
      this.saveRealmHistory({
        realmId,
        eventId,
        eventType: "food_created",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          buildingId,
          buildingName: BuildingNameById[buildingId + ""],
          qty,
          harvests,
        },
      }),
    ]);
  }

  async onHarvest(event: Event) {
    this.onHarvest_2(event);
  }

  async onHarvest_2(event: Event) {
    const eventId = event.eventId;
    const params = event.parameters ?? [];
    const realmId = parseInt(params[0]);
    const buildingId = parseInt(params[2]);
    const harvests = parseInt(params[3]) || 0;
    const updatedAt = params[4]
      ? new Date(parseInt(params[4]) * 1000)
      : event.timestamp;
    try {
      const where = {
        realmId_buildingId: { realmId, buildingId },
      };

      await Promise.all([
        this.context.prisma.food.upsert({
          where,
          create: {
            realmId,
            eventId,
            buildingId,
            qty: 1,
            harvests,
            createdAt: updatedAt,
            updatedAt,
          },
          update: {
            harvests,
            updatedAt,
          },
        }),
        this.saveRealmHistory({
          realmId,
          eventId,
          eventType: "food_harvest",
          timestamp: event.timestamp,
          transactionHash: event.txHash,
          data: {
            buildingId,
            buildingName: BuildingNameById[buildingId + ""],
            qty: 1,
            harvests,
          },
        }),
      ]);
    } catch (e) {
      console.log("Food harvest error", event.eventId);
      console.log(e);
    }
  }
}
