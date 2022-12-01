import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import { updateWallet } from "../../utils/WalletBalance";
import BaseContractIndexer from "./../BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";
import { BigNumber } from "ethers";

function arrayUInt256ToBigNumber([low, high]: any[]): BigNumberish {
  return uint256ToBN({ low, high }).toString();
}

export const CONTRACT =
  "0x0371e76cc9dc2cf151201e3fff62dc816636fe918e4c90604e9ed1369b7d1d5e";

export default class LordsIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("Transfer", this.transfer.bind(this));
  }

  async transfer(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    const eventId = event.eventId;
    const fromAddress = BigNumber.from(params[0]).toHexString();
    const toAddress = BigNumber.from(params[1]).toHexString();
    const amount = arrayUInt256ToBigNumber(params.slice(2, 4));

    const lastWalletBalanceEventId = (
      await this.context.prisma.walletBalance.findFirst({
        orderBy: { lastEventId: "desc" }
      })
    )?.lastEventId;
    if (!lastWalletBalanceEventId || lastWalletBalanceEventId < eventId) {
      await updateWallet(
        this.context,
        toAddress,
        fromAddress,
        0,
        amount,
        eventId
      );
    }
  }
}
