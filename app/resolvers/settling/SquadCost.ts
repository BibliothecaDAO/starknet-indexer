import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "../../context";
import { SquadCost } from "../../entities";
import { SquadCostInput } from "../types";

@Resolver((_of) => SquadCost)
export class SquadCostResolver {
  @Query(() => [SquadCost])
  async getSquadCosts(@Ctx() ctx: Context) {
    return await ctx.prisma.squadCost.findMany();
  }

  @Mutation(() => SquadCost)
  async createOrUpdateSquadCost(
    @Arg("data")
    data: SquadCostInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.squadCost.upsert({
      where: {
        squadType: data.squadType
      },
      update: {
        resourceType: data.resourceType,
        qty: data.qty
      },
      create: data
    });
  }
}
