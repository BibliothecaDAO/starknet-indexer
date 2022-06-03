import { Event } from "./../entities/starknet/Event";
import { Context } from "./../context";
import BaseContractIndexer from "./BaseContractIndexer";
import { ResourceNameById } from "./../utils/game_constants";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";

function arrayUInt256ToNumber([low, high]: any[]): number {
  return parseInt(uint256ToBN({ low, high }).toString());
}

function arrayUInt256ToBigNumber([low, high]: any[]): BigNumberish {
  return parseInt(uint256ToBN({ low, high }).toString());
}

const CONTRACT =
  "0x043f4c6a92250cda1e297988840dff5506d8f8cef4cabe2e48bd4b4718bf4a70";
export default class ResourceERC1155Indexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("TransferSingle", this.transferSingle.bind(this));
    this.on("TransferBatch", this.transferBatch.bind(this));
  }

  /*
    address indexed _operator,
    address indexed _from,
    address indexed _to,
    uint256 _id,
    uint256 _amount
  */
  async transferSingle(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    // const eventId = event.eventId;
    // const fromAddress = BigNumber.from(params[1]).toHexString();
    // const toAddress = BigNumber.from(params[2]).toHexString();
    const tokenId = arrayUInt256ToNumber(params.slice(3, 5));
    const tokenName = ResourceNameById[String(tokenId)];
    const amount = arrayUInt256ToBigNumber(params.slice(5, 7));
    //const resources =
    [{ tokenId, tokenName, amount }];
  }

  async transferBatch(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    // const eventId = event.eventId;
    // const fromAddress = BigNumber.from(params[1]).toHexString();
    // const toAddress = BigNumber.from(params[2]).toHexString();
    const arrayLen = parseInt(params[3]);
    const resources: {
      tokenId: number;
      tokenName: string;
      amount: BigNumberish;
    }[] = [];
    const startIdIdx = 4;
    const startAmountIdx = startIdIdx + arrayLen;
    for (let i = 0; i < arrayLen; i++) {
      let idIdx = startIdIdx + i * 2;
      const tokenId = arrayUInt256ToNumber(params.slice(idIdx, idIdx + 2));
      const tokenName = ResourceNameById[String(tokenId)];
      let amountIdx = startAmountIdx + i * 2;
      const amount = arrayUInt256ToBigNumber(
        params.slice(amountIdx, amountIdx + 2)
      );
      resources.push({ tokenId, tokenName, amount });
    }
  }
}
