import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import { BigNumber } from "ethers";
import BaseContractIndexer from "./../BaseContractIndexer";
import * as Settling from "./SettlingIndexer";

const SETTLING_CONTRACT_ADDRESS = Settling.CONTRACT;

const CONTRACT =
  "0x02ab849a3eaf4fd54f80e6dbe7a8d182646ec41684d1f1a4f718623bd8cb0695";

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

      const isMint = params[0] === "0";
      let isSettlingEvent =
        this.isSettlingContract(toAddress) ||
        this.isSettlingContract(fromAddress);
      let eventType = isMint ? "realm_mint" : "realm_transfer";

      await this.context.prisma.realm.update({
        data: { ownerL2: toAddress },
        where
      });

      if (!isSettlingEvent) {
        //SRealmIndexer will handle realm history
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
