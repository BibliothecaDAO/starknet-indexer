import { Event } from "./../entities/starknet/Event";
import { Context } from "./../context";
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
      const realmId = parseInt(params[2]);

      if (!realmId || realmId > 8000) {
        // TODO: update when realm count increases
        console.log("Unknown Realm Transfer", event.txHash);
        return;
      }
      const eventId = event.eventId;
      const where = { realmId };
      const fromAddress = BigNumber.from(params[0]).toHexString();
      const toAddress = BigNumber.from(params[1]).toHexString();
      let account = "";
      //ensure wallet is created
      await this.context.prisma.wallet.upsert({
        where: { address: toAddress },
        update: { address: toAddress },
        create: { address: toAddress }
      });

      let eventType = "realm_settle";
      if (this.isSettlingContract(toAddress)) {
        await this.context.prisma.realm.update({
          data: { ownerL2: toAddress, settledOwner: fromAddress },
          where
        });
        account = fromAddress;
      } else {
        if (params[0] === "0") {
          eventType = "realm_mint";
        } else if (this.isSettlingContract(fromAddress)) {
          eventType = "realm_unsettle";
        } else {
          eventType = "realm_transfer";
        }
        await this.context.prisma.realm.update({
          data: { ownerL2: toAddress, settledOwner: null },
          where
        });
        account = toAddress;
      }
      await this.saveRealmHistory({
        realmId,
        eventId,
        eventType,
        account,
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          fromAddress,
          toAddress
        }
      });
    } catch (e) {
      console.error(
        `Invalid realms update: Event: ${event.eventId}, Params: `,
        JSON.stringify(params)
      );
      throw e;
    }
  }
}
