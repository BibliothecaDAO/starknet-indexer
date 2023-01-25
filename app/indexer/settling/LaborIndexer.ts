import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { ResourceNameById } from "./../../utils/game_constants";
import { BigNumberish } from "starknet/utils/number";
import { uint256ToBN } from "starknet/utils/uint256";

const CONTRACT =
  "0x03c934d404e76daae48d9b17eb2a4a973938dbd3115bd353e756bcefe0d799a3";

function arrayUInt256ToNumber([low, high]: any[]): BigNumberish {
  return parseInt(uint256ToBN({ low, high }).toString());
}

function toOptionalDate(val: number) {
  return val > 0 ? new Date(val * 1000) : null;
}

export default class LaborIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("UpdateLabor", this.updateLabor.bind(this));
    this.on("FoodBuildingsBuilt", this.foodBuildingsBuilt.bind(this));
  }

  async updateLabor(event: Event): Promise<void> {
    const eventId = event.eventId;
    const params = event.parameters ?? [];
    const realmId = arrayUInt256ToNumber(params.slice(0, 2));
    const resourceId = arrayUInt256ToNumber(params.slice(2, 4));

    const lastUpdate = parseInt(params[4]) || 0;
    const balance = parseInt(params[5]) || 0;
    const vaultBalance = parseInt(params[6]) || 0;
    const updatedAt = new Date();
    const where = {
      realmId_resourceId: { realmId, resourceId },
    };
    const updates = {
      lastUpdate: toOptionalDate(lastUpdate),
      vaultBalance: toOptionalDate(vaultBalance),
      balance: toOptionalDate(balance),
      updatedAt,
      lastEventId: eventId,
    };

    await Promise.all([
      this.context.prisma.labor.upsert({
        where,
        create: {
          ...where.realmId_resourceId,
          ...updates,
          createdAt: updatedAt,
        },
        update: { ...updates },
      }),
      this.saveRealmHistory({
        realmId,
        eventId,
        eventType: "labor_updated",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          resourceId,
          resourceName: ResourceNameById[resourceId + ""],
          ...updates,
        },
      }),
    ]);
  }

  async foodBuildingsBuilt(event: Event): Promise<void> {
    const eventId = event.eventId;
    const params = event.parameters ?? [];
    const realmId = arrayUInt256ToNumber(params.slice(0, 2));
    const resourceId = arrayUInt256ToNumber(params.slice(2, 4));

    const qtyBuilt = parseInt(params[4]) || 0;

    const updatedAt = new Date();
    const where = {
      realmId_resourceId: { realmId, resourceId },
    };
    const updates = {
      qtyBuilt,
      updatedAt,
      lastEventId: eventId,
    };

    await Promise.all([
      this.context.prisma.labor.upsert({
        where,
        create: {
          ...where.realmId_resourceId,
          ...updates,
          createdAt: updatedAt,
        },
        update: { ...updates },
      }),
      this.saveRealmHistory({
        realmId,
        eventId,
        eventType: "food_building_built",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          resourceId,
          resourceName: ResourceNameById[resourceId + ""],
          ...updates,
        },
      }),
    ]);
  }
}
