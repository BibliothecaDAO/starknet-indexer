import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

function arrayUInt256ToNumber([low, high]: any[]): number {
  return parseInt(uint256ToBN({ low, high }).toString());
}

function arrayUInt256ToBigNumber([low, high]: any[]): BigNumberish {
  return uint256ToBN({ low, high }).toString();
}

export const CONTRACT =
  "0x0004d3180171dc5dd583762aaad99e50c17e27bf73a3e949a89a0db5bb628e40";

export default class ResourceERC1155Indexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("TransferSingle", this.transferSingle.bind(this));
    this.on("TransferBatch", this.transferBatch.bind(this));
  }

  async transferSingle(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    const eventId = event.eventId;
    const operatorAddress = BigNumber.from(params[0]).toHexString();
    const fromAddress = BigNumber.from(params[1]).toHexString();
    const toAddress = BigNumber.from(params[2]).toHexString();
    const resourceId = arrayUInt256ToNumber(params.slice(3, 5));
    const amount = arrayUInt256ToBigNumber(params.slice(5, 7));
    const transactionHash = event.txHash;
    const [blockNumber, transactionNumber] = eventId
      .split("_")
      .map((value) => parseInt(value)) as number[];

    const updates = {
      operatorAddress,
      toAddress,
      fromAddress,
      blockNumber,
      transactionNumber,
      amount,
      amountValue: formatEther(amount),
      transactionHash,
      timestamp: event.timestamp,
    };
    await this.context.prisma.resourceTransfer.upsert({
      where: { resourceId_eventId: { eventId, resourceId } },
      update: { ...updates },
      create: { ...updates, eventId, resourceId, amount },
    });
  }

  async transferBatch(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    const eventId = event.eventId;
    const transactionHash = event.txHash;
    const timestamp = event.timestamp;

    const [blockNumber, transactionNumber] = eventId
      .split("_")
      .map((value) => parseInt(value)) as number[];

    const operatorAddress = BigNumber.from(params[0]).toHexString();
    const fromAddress = BigNumber.from(params[1]).toHexString() as string;
    const toAddress = BigNumber.from(params[2]).toHexString() as string;
    const arrayLen = parseInt(params[3]);
    const startIdIdx = 4;
    const startAmountIdx = startIdIdx + arrayLen * 2 + 1;

    const upserts: any[] = [];
    for (let i = 0; i < arrayLen; i++) {
      let idIdx = startIdIdx + i * 2;
      const resourceId = arrayUInt256ToNumber(params.slice(idIdx, idIdx + 2));
      let amountIdx = startAmountIdx + i * 2;
      const amount = arrayUInt256ToBigNumber(
        params.slice(amountIdx, amountIdx + 2)
      );
      const updates = {
        operatorAddress,
        toAddress,
        fromAddress,
        blockNumber,
        transactionNumber,
        amount,
        amountValue: formatEther(amount),
        transactionHash,
        timestamp,
      };
      upserts.push(
        this.context.prisma.resourceTransfer.upsert({
          where: { resourceId_eventId: { eventId, resourceId } },
          update: { ...updates },
          create: { ...updates, eventId, resourceId, amount },
        })
      );
    }
    await Promise.all(upserts);
  }
}
