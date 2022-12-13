import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import { BigNumber } from "ethers";
import BaseContractIndexer from "./../BaseContractIndexer";

const CONTRACT =
  "0x016a1b978c62be5c30faa565f2086336126db3f120fbe61f368d8e07f289ef03";

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
        create: { address: toAddress },
      });

      const isSettle = fromAddress === "0x00";
      const isUnSettle = toAddress === "0x00";

      const eventType = isSettle
        ? "realm_settle"
        : isUnSettle
        ? "realm_unsettle"
        : "realm_transfer";

      await Promise.all([
        this.context.prisma.realm.update({
          data: { settledOwner: !isUnSettle ? toAddress : null },
          where,
        }),
        this.saveRealmHistory({
          realmId,
          eventId,
          eventType,
          account,
          timestamp: event.timestamp,
          transactionHash: event.txHash,
          data: { fromAddress, toAddress },
        }),
      ]);
    } catch (e) {
      console.error(
        `Invalid realms update: Event: ${event.eventId}, Params: `,
        JSON.stringify(params)
      );
      throw e;
    }
  }
}
