import { Resolver, Query } from "type-graphql";
import { TroopStats, Troop } from "../../entities";
import * as CONSTANTS from "../../utils/game_constants";

@Resolver((_of) => Troop)
export class TroopResolver {
  private troopStats: TroopStats[];
  constructor() {
    const troopKeys = Object.keys(CONSTANTS.TroopId);
    this.troopStats = troopKeys.map((troopKey) => {
      const troopStats = new TroopStats();
      troopStats.troopId = CONSTANTS.TroopId[troopKey as CONSTANTS.TroopName];
      const stats = CONSTANTS.TroopStat[troopKey as CONSTANTS.TroopName];
      troopStats.type = stats[0];
      troopStats.tier = stats[1];
      troopStats.agility = stats[2];
      troopStats.attack = stats[3];
      troopStats.defense = stats[4];
      troopStats.vitality = stats[5];
      troopStats.wisdom = stats[6];
      return troopStats;
    });
  }

  @Query(() => [TroopStats])
  async getTroopStats() {
    return this.troopStats;
  }
}
