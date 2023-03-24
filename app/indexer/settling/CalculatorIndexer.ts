import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";

const CONTRACT =
  "0x04d0973873380a3d92a3f65e2b649ac78e9afd7457ee033cbcb4e1eeaefc8ab8";

function arrayUInt256ToNumber([low, high]: any[]): BigNumberish {
  return parseInt(uint256ToBN({ low, high }).toString());
}

export default class CalculatorIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("SinceLastTick", this.lastTick.bind(this));
  }

  async lastTick(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    const realmId = arrayUInt256ToNumber(params.slice(0, 2));
    const lastTick = new Date(parseInt(params[2]) * 1000);
    await this.context.prisma.realm.update({
      where: { realmId },
      data: { lastTick },
    });
  }
}
