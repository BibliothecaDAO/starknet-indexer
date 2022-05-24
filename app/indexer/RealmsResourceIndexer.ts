import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import BaseContractIndexer from "./BaseContractIndexer";

const CONTRACT =
  "0x04a29535b95b85aca744a0b1bcc2faa1972f0769db1ec10780bb7c01ce3fe8fd";
export default class RealmsResourceIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.addHandler("ResourceUpgraded", this.upgradeResource.bind(this));
  }

  async upgradeResource(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    let resourceId = 0;
    let where = {};
    let resource;
    try {
      resourceId = parseInt(params[2]);
      where = {
        resourceId_realmId: {
          realmId: parseInt(params[0]),
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
    }

    if (resource) {
      let upgrades = resource.upgrades ?? [];
      const timestamp = event.timestamp.toISOString();
      if (upgrades.indexOf(timestamp) === -1) {
        upgrades.push(timestamp);
      }
      await this.context.prisma.resource.update({
        where,
        data: {
          level: parseInt(params[3]),
          upgrades: [...upgrades]
        }
      });
    }
  }
}
