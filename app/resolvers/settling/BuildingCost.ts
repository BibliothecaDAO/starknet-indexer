import { Resolver, Query, Ctx } from "type-graphql";
import { Context } from "./../../context";
import { BuildingCost } from "./../../entities";

@Resolver((_of) => BuildingCost)
export class BuildingCostResolver {
  @Query(() => [BuildingCost])
  async getBuildingCosts(@Ctx() ctx: Context) {
    return await ctx.prisma.buildingCost.findMany();
  }
}
