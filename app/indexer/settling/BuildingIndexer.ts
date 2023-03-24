import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { BuildingNameById } from "./../../utils/game_constants";

export const CONTRACT =
  "0x02061529fcb9e9a1b2aa59b3b1f55f6e13b26643df76a865f00ad029e2c8afdf";

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
      realmId_buildingId: { realmId, buildingId },
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

    const count = getBuildingCount(
      buildingIntegrityTimestamp,
      timestamp,
      buildingId
    );
    const updates = {
      buildingId,
      realmId,
      buildingIntegrity: buildingIntegrityTimestamp,
      count,
      timestamp,
    };
    await Promise.all([
      this.context.prisma.buildBuildingEvent.upsert({
        where: { eventId },
        create: { eventId, ...updates },
        update: { ...updates },
      }),
      this.context.prisma.building.upsert({
        where,
        create: {
          realmId,
          eventId,
          buildingIntegrity: buildingIntegrityTimestamp,
          buildingId,
          builds: [...builds],
        },
        update: {
          buildingId,
          eventId,
          buildingIntegrity: buildingIntegrityTimestamp,
          builds: [...builds],
        },
      }),
      this.saveRealmHistory({
        realmId,
        eventId,
        eventType: "realm_building_built",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          buildingId,
          buildingName: BuildingNameById[buildingId + ""],
          buildingIntegrity: buildingIntegrityTimestamp,
        },
      }),
    ]);
  }
}

const DAY = 86400;
const BUILDING_INTEGRITY = [
  0,
  3 * DAY,
  2000,
  2000,
  2000,
  2000,
  7 * DAY,
  7 * DAY,
  7 * DAY,
  7 * DAY,
];
const getBuildingCount = (
  integrity: number,
  timestamp: any,
  buildingId: number
) => {
  const buildings = Math.floor(
    (integrity - new Date(timestamp).getTime() / 1000) /
      BUILDING_INTEGRITY[buildingId]
  );
  return buildings < 0 ? 0 : buildings;
};
