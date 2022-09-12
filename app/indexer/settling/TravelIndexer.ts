import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";

const CONTRACT =
  "0x05f273c4a45dab6e8112e2370bd84f58cfd2f1ff83752c2582241c0c0acba9be";

export default class TravelIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("TravelAction", this.travelAction.bind(this));
  }

  async travelAction(event: Event): Promise<void> {
    const eventId = event.eventId as string;
    const params = event.parameters ?? [];
    const contractId = +params[0];
    const tokenId = arrayUInt256ToNumber(params.slice(1, 3)) as number;
    const nestedId = +params[3];

    const destinationContractId = +params[4];
    const destinationTokenId = arrayUInt256ToNumber(
      params.slice(5, 7)
    ) as number;
    const destinationNestedId = +params[7];
    const arrivalTime = new Date(+params[8] * 1000);

    const updates = {
      contractId,
      tokenId,
      nestedId,
      destinationContractId,
      destinationTokenId,
      destinationNestedId,
      arrivalTime,
      timestamp: event.timestamp
    };
    await this.context.prisma.travel.upsert({
      where: { eventId },
      create: { ...updates, eventId },
      update: { ...updates }
    });
  }
}

function arrayUInt256ToNumber([low, high]: any[]): BigNumberish {
  return parseInt(uint256ToBN({ low, high }).toString());
}
