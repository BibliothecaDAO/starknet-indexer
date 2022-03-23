import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "../../context";
import { BuildingCost } from "../../entities";
import { BuildingCostInput } from "../types";

@Resolver((_of) => BuildingCost)
export class BuildingCostResolver {
  @Query(() => [BuildingCost])
  async getBuildingCosts(@Ctx() ctx: Context) {
    return await ctx.prisma.buildingCost.findMany();
  }

  @Mutation(() => BuildingCost)
  async createOrUpdateBuildingCost(
    @Arg("data")
    data: BuildingCostInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.buildingCost.upsert({
      where: {
        buildingType: data.buildingType
      },
      update: {
        resourceType: data.resourceType,
        qty: data.qty
      },
      create: data
    });
  }
}
