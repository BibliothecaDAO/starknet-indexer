import { Event } from "./../entities/starknet/Event";
import { Context } from "./../context";
import BaseContractIndexer from "./BaseContractIndexer";
import { ResourceNameById } from "./../utils/game_constants";

const CONTRACT =
  "0x04a29535b95b85aca744a0b1bcc2faa1972f0769db1ec10780bb7c01ce3fe8fd";
export default class RealmsResourceIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("ResourceUpgraded", this.upgradeResource.bind(this));
  }

  async upgradeResource(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    const eventId = event.eventId;
    const realmId = parseInt(params[0]);
    let resourceId = 0;
    let where = {};
    let resource;
    try {
      resourceId = parseInt(params[2]);
      where = {
        resourceId_realmId: {
          realmId,
          resourceId
        }
      };
      resource = await this.context.prisma.resource.findUnique({
        where
      });
    } catch (e) {
      console.error(
        `Invalid resource upgrade: Event: ${event.eventId}, Params: `,
        JSON.stringify(params)
      );
      throw e;
    }

    if (resource) {
      let upgrades = resource.upgrades ?? [];
      const timestamp = event.timestamp.toISOString();
      if (upgrades.indexOf(timestamp) === -1) {
        upgrades.push(timestamp);
      }
      const level = parseInt(params[3]);
      await this.context.prisma.resource.update({
        where,
        data: {
          level,
          upgrades: [...upgrades]
        }
      });

      await this.saveRealmEvent({
        realmId,
        eventId,
        eventType: "realm_resource_upgraded",
        account: event.toAddress,
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          resourceId,
          resourceName: ResourceNameById[resourceId + ""],
          level
        }
      });
    }
  }
}
