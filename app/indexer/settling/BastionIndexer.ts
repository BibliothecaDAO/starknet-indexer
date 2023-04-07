import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumber } from "ethers";

const CONTRACT =
  "0x01c21c4d9e15918f9585ccf02640ad2a86c0bc60c64771f6afb727c553ab417b";

export default class BastionIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("BastionArmyMoved", this.bastionArmyMoved.bind(this));
    this.on("BastionLocationTaken", this.bastionLocationTaken.bind(this));
  }

  async bastionArmyMoved(event: Event): Promise<void> {
    const eventId = event.eventId as string;
    const params = event.parameters;
    const longitude = BigNumber.from(params[0]).toNumber();
    const latitude = BigNumber.from(params[1]).toNumber();
    const bastionPastLocation = parseInt(params[2]);
    const bastionCurrentLocation = parseInt(params[3]);
    const bastionArrivalBlock = parseInt(params[4]);
    const realmId = arrayUInt256ToNumber(params.slice(5, 7));
    const armyId = parseInt(params[7]);
    const bastionId = createBastionId(latitude, longitude);

    // only index events with 8 params
    // 1 param was added in event in the last version of the contract
    if (params.length === 8) {
    try {
      const promises = await Promise.allSettled([
      this.context.prisma.army.update({
        where: { realmId_armyId: { realmId, armyId } },
        data: {
          bastionId,
          bastionPastLocation,
          bastionCurrentLocation,
          bastionArrivalBlock: bastionArrivalBlock,
        },
      }),
      this.saveRealmHistory({
        realmId,
        bastionId: bastionId,
        eventId,
        eventType: "bastion_army_move",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          armyId,
          bastionPastLocation,
          bastionCurrentLocation,
          bastionArrivalBlock,
        },
      })
    ]);
    console.log(promises)
    } catch (e) {};
    }

  }

  // TODO: add the realm id, army id and previous order to the event
  async bastionLocationTaken(event: Event): Promise<void> {
    const eventId = event.eventId as string;
    const params = event.parameters;
    const longitude = BigNumber.from(params[0]).toNumber();
    const latitude = BigNumber.from(params[1]).toNumber();
    const locationId = parseInt(params[2]);
    const defendingOrderId = parseInt(params[3]);
    const cooldownEnd = parseInt(params[4]);
    const bastionId = createBastionId(latitude, longitude);

    const bastionLocation = await this.context.prisma.bastionLocation.findFirst({
      where: {
        bastionId,
        locationId
      }
    })
    const previousDefendingOrderId = bastionLocation?.defendingOrderId

    await Promise.allSettled([
      this.context.prisma.bastion.upsert({
        where: { bastionId },
        update: { longitude, latitude },
        create: { bastionId, longitude, latitude },
      }),
      this.context.prisma.bastionLocation.upsert({
        where: { bastionId_locationId: { bastionId, locationId } },
        update: { defendingOrderId, takenBlock: event.blockNumber },
        create: {
          bastionId,
          locationId,
          defendingOrderId,
          takenBlock: event.blockNumber,
        },
      }),
      this.saveRealmHistory({
        realmId: 0,
        bastionId: bastionId,
        eventId,
        eventType: "bastion_take_location",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          locationId,
          defendingOrderId,
          cooldownEnd,
          previousDefendingOrderId: previousDefendingOrderId? previousDefendingOrderId: 0,
        },
      })
    ]);
  }
}

function createBastionId(lat: number, lon: number) {
  return lat + lon;
}

function arrayUInt256ToNumber([low, high]: any[]) {
  return parseInt(uint256ToBN({ low, high }).toString());
}
