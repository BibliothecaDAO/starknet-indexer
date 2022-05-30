import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { BigNumber } from "ethers";
import BaseContractIndexer from "./BaseContractIndexer";

const SETTLING_CONTRACT_ADDRESS =
  "0x077b2a96db5fb49200f11155f6c2b1f5c0e697fb62d6b2c290592a1cb0ad0356";
const CONTRACT =
  "0x0741568eef7e69072fac5ac490ef2dca278fe75898814326fc37b0c6b36e94e0";

export default class RealmsL2Indexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("Transfer", this.transferRealm.bind(this));
  }

  isSettlingContract(address: string) {
    return SETTLING_CONTRACT_ADDRESS === address;
  }

  async transferRealm(event: Event): Promise<void> {
    const params = event.parameters ?? [];

    try {
      const where = {
        realmId: parseInt(params[2])
      };
      const fromAddress = BigNumber.from(params[0]).toHexString();
      const toAddress = BigNumber.from(params[1]).toHexString();

      //ensure wallet is created
      await this.context.prisma.wallet.upsert({
        where: { address: toAddress },
        update: { address: toAddress },
        create: { address: toAddress }
      });

      if (this.isSettlingContract(toAddress)) {
        await this.context.prisma.realm.update({
          data: { ownerL2: toAddress, settledOwner: fromAddress },
          where
        });
      } else {
        await this.context.prisma.realm.update({
          data: { ownerL2: toAddress, settledOwner: null },
          where
        });
      }
    } catch (e) {
      console.error(
        `Invalid realms update: Event: ${event.eventId}, Params: `,
        JSON.stringify(params)
      );
      throw e;
    }
  }
}
