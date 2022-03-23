import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "../../context";
import { Building } from "../../entities";
import { BuildingInput } from "../types";

@Resolver((_of) => Building)
export class BuildingResolver {
  @Query((_returns) => Building, { nullable: false })
  async getBuildings(@Arg("id") id: number, @Ctx() ctx: Context) {
    return await ctx.prisma.building.findUnique({
      where: { id }
    });
  }

  @Query(() => [Building])
  async getAllBuildings(@Ctx() ctx: Context) {
    return await ctx.prisma.building.findMany();
  }

  @Mutation(() => Building)
  async createOrUpdateBuildings(
    @Arg("data")
    data: BuildingInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.building.upsert({
      where: {
        id: data.id
      },
      update: {
        type: data.type,
        realmId: data.realmId
      },
      create: {
        id: data.id,
        type: data.type,
        realmId: data.realmId
      }
    });
  }
}
