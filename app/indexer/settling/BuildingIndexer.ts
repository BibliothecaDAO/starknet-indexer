import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { BuildingNameById } from "./../../utils/game_constants";

const CONTRACT =
  "0x01c7a86cea8febe69d688dd5ffa361e7924f851db730f4256ed67fd805ea8aa7";

export default class BuildingIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    //this.on("BuildingBuilt", this.buildBuilding.bind(this));
    this.on("BuildingIntegrity", this.buildingIntegrity.bind(this));
  }

  async buildingIntegrity(event: Event): Promise<void> {
    const eventId = event.eventId;
    const params = event.parameters ?? [];
    const realmId = parseInt(params[0]);
    const buildingId = parseInt(params[2]);
    const buildingIntegrityTimestamp = parseInt(params[3]) || 0;

    const where = {
      realmId_buildingId: { realmId, buildingId }
    };
    let builds: any[] = [];
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
      create: {
        realmId,
        eventId,
        buildingIntegrity: buildingIntegrityTimestamp,
        buildingId,
        builds: [...builds]
      },
      update: {
        buildingId,
        eventId,
        buildingIntegrity: buildingIntegrityTimestamp,
        builds: [...builds]
      }
    });
    await this.saveRealmHistory({
      realmId,
      eventId,
      eventType: "realm_building_built",
      timestamp: event.timestamp,
      transactionHash: event.txHash,
      data: {
        buildingId,
        buildingName: BuildingNameById[buildingId + ""],
        buildingIntegrity: buildingIntegrityTimestamp
      }
    });
  }
}
