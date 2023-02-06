import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";

const RELIC_ADDRESS =
  "0x06052bf4631585f7074a118543121561d12cc910e0ab95b48039eab587e078d2";

export default class RealmsL2Indexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, RELIC_ADDRESS);

    this.on("RelicUpdate", this.relicUpdate.bind(this));
  }

  async relicUpdate(event: Event): Promise<void> {
    const params = event.parameters ?? [];

    try {
      const realmId = parseInt(params[0]);
      const ownerTokenId = parseInt(params[2]);

      if (!realmId || realmId > 8000) {
        // TODO: update when realm count increases
        console.log("Unknown Realm Transfer", event.txHash);
        return;
      }
      const eventId = event.eventId;
      const udpates = {
        heldByRealm: ownerTokenId,
        isAnnexed: ownerTokenId != realmId,
      };
      await Promise.all([
        this.context.prisma.relic.upsert({
          where: { realmId },
          create: { realmId, ...udpates },
          update: { ...udpates },
        }),

        this.saveRealmHistory({
          realmId: realmId,
          eventId,
          eventType: "relic_update",
          timestamp: event.timestamp,
          transactionHash: event.txHash,
          data: {
            ...udpates,
          },
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
