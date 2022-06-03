import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "./../../context";
import { Building } from "./../../entities";
import * as CONSTANTS from "./../../utils/game_constants";
import { BuildingCost } from "./../../entities";

@Resolver((_of) => Building)
export class BuildingResolver {
  private buildingCosts: BuildingCost[];
  private allBuildingIds: number[];
  constructor() {
    const buildingNames = Object.keys(CONSTANTS.BuildingId);
    this.buildingCosts = buildingNames.map((buildingName) => {
      const buildingCost =
        CONSTANTS.BuildingCost[buildingName as CONSTANTS.BuildingName];
      return {
        buildingId:
          CONSTANTS.BuildingId[buildingName as CONSTANTS.BuildingName],
        buildingName,
        ...buildingCost
      };
    });
    this.allBuildingIds = buildingNames.map((buildingName) => {
      return CONSTANTS.BuildingId[buildingName as CONSTANTS.BuildingName];
    });
  }

  @Query(() => [Building])
  async getBuildingsByRealmId(@Ctx() ctx: Context, @Arg("id") id: number) {
    let realmId = id;
    const traits = await await ctx.prisma.realmTrait.findMany({
      where: { realmId }
    });

    const buildings = await ctx.prisma.building.findMany({
      where: {
        realmId: realmId
      }
    });

    const data = this.allBuildingIds.map((buildingId) => {
      const building = new Building();
      building.buildingId = buildingId;
      building.realmId = realmId;
      const ownedBuilding = buildings.find(
        (build) => build.buildingId === buildingId
      );
      if (ownedBuilding && ownedBuilding.builds?.length > 0) {
        building.builds = [...ownedBuilding.builds];
      }
      const trait = traits.find(
        (trait) => trait.type === building.limitTraitName
      );
      building.limit = trait?.qty ?? 0;
      return building;
    });

    return data;
  }

  @Query(() => [BuildingCost])
  async getBuildingCosts() {
    return this.buildingCosts;
  }

  @Query(() => BuildingCost)
  async getBuildingCostById(id: number) {
    return this.buildingCosts.find((cost) => cost.buildingId === id);
  }
}
