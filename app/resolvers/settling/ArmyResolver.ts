import { Resolver, Query } from "type-graphql";
import { Army, BattalionCost } from "../../entities";
import * as CONSTANTS from "../../utils/game_constants";

@Resolver((_of) => Army)
export class ArmyResolver {
  private _battalionCosts: BattalionCost[];
  // private allBattalionIds: number[];

  constructor() {
    const battalionNames = Object.keys(CONSTANTS.BattalionId);
    this._battalionCosts = battalionNames.map((battalionName) => {
      const battalionCost =
        CONSTANTS.BattalionCost[battalionName as CONSTANTS.BattalionName];
      return {
        battalionId:
          CONSTANTS.BattalionId[battalionName as CONSTANTS.BattalionName],
        battalionName,
        ...battalionCost
      };
    });
    //   this.allBattalionIds = battalionNames.map((battalionName) => {
    //     return CONSTANTS.BattalionId[battalionName as CONSTANTS.BattalionName];
    //   });
  }

  @Query(() => [BattalionCost])
  async battalionCosts() {
    return this._battalionCosts;
  }
}
