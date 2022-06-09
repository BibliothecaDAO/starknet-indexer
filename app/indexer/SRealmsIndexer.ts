import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { BigNumber } from "ethers";
import BaseContractIndexer from "./BaseContractIndexer";

const CONTRACT =
  "0x007235420ad11fa85b9e9837fb03a0b42a56cc930dd51a9aadbb5ad229eabe77";

export default class SRealmsIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("Transfer", this.transferSRealm.bind(this));
  }

  async transferSRealm(event: Event): Promise<void> {
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

      const isSettle = params[0] === "0";
      const isUnSettle = params[1] === "0";

      await this.context.prisma.realm.update({
        data: { settledOwner: !isUnSettle ? toAddress : null },
        where
      });

      const eventType = isSettle
        ? "realm_settle"
        : isUnSettle
        ? "realm_unsettle"
        : "realm_transfer";

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
