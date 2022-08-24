import { Resolver, Query } from "type-graphql";
import { TroopStats, Troop } from "../../entities";
import * as CONSTANTS from "../../utils/game_constants";

@Resolver((_of) => Troop)
export class TroopResolver {
  private stats: TroopStats[];
  constructor() {
    const troopKeys = Object.keys(CONSTANTS.TroopId);
    this.stats = troopKeys.map((troopKey) => {
      const troopStats = new TroopStats();
      troopStats.troopId = CONSTANTS.TroopId[troopKey as CONSTANTS.TroopName];
      const stats = CONSTANTS.TroopStat[troopKey as CONSTANTS.TroopName];
      troopStats.type = stats[0];
      troopStats.tier = stats[1];
      troopStats.building = stats[2];
      troopStats.agility = stats[3];
      troopStats.attack = stats[4];
      troopStats.armor = stats[5];
      troopStats.vitality = stats[6];
      troopStats.wisdom = stats[7];
      return troopStats;
    });
  }

  @Query(() => [TroopStats])
  async getTroopStats() {
    return this.troopStats();
  }

  @Query(() => [TroopStats])
  troopStats(): TroopStats[] {
    return this.stats;
  }
}
