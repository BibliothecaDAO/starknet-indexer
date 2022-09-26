import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";

const RELIC_ADDRESS =
  "0x027d0dd8dbe02f8dec5ff64b873eb78993c520f7c6f10b95f86cb061857769d0";

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

      await this.context.prisma.relic.upsert({
        where: { realmId },
        create: { realmId, heldByRealm: ownerTokenId },
        update: { heldByRealm: ownerTokenId }
      });

      this.saveRealmHistory({
        realmId: realmId,
        eventId,
        eventType: "relic_update",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          heldByRealm: ownerTokenId
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
