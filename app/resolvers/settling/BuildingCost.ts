import { Resolver, Query } from "type-graphql";
import { BuildingCost } from "./../../entities";
import * as game_constants from "./../../utils/game_constants";

@Resolver((_of) => BuildingCost)
export class BuildingCostResolver {
  @Query(() => [BuildingCost])
  async getBuildingCosts() {
    const buildingNames = Object.keys(game_constants.BuildingId);

    return buildingNames.map((buildingName) => {
      const buildingCost =
        game_constants.BuildingCost[
          buildingName as game_constants.BuildingName
        ];
      return {
        buildingId:
          game_constants.BuildingId[
            buildingName as game_constants.BuildingName
          ],
        buildingName,
        ...buildingCost
      };
    });
  }
}
