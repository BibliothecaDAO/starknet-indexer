import { Event } from "./../entities/starknet/Event";
import { Context } from "./../context";
import BaseContractIndexer from "./BaseContractIndexer";
import { BuildingNameById } from "./../utils/game_constants";

const CONTRACT =
  "0x04d2078fade1855b48ad11d711d11afa107f050637572eecbab244a4cd7f35cc";

export default class RealmsBuildingIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("BuildingBuilt", this.buildBuilding.bind(this));
  }

  async buildBuilding(event: Event): Promise<void> {
    const eventId = event.eventId;
    const params = event.parameters ?? [];
    const realmId = parseInt(params[0]);
    const buildingId = parseInt(params[2]);
    const where = {
      realmId_eventId: { realmId, eventId }
    };

    let builds: string[] = [];
    const building = await this.context.prisma.building.findUnique({ where });
    if (building) {
      builds = building.builds ?? [];
    }

    const timestamp = event.timestamp.toISOString();
    if (builds.indexOf(timestamp) === -1) {
      builds.push(timestamp);
    }

    await this.context.prisma.building.upsert({
      where,
      create: { realmId, eventId, buildingId, builds: [...builds] },
      update: { buildingId, builds: [...builds] }
    });
    await this.saveRealmEvent({
      realmId,
      eventId,
      eventType: "realm_building_built",
      account: event.toAddress,
      timestamp: event.timestamp,
      transactionHash: event.txHash,
      data: {
        buildingId,
        buildingName: BuildingNameById[buildingId + ""]
      }
    });
  }
}
