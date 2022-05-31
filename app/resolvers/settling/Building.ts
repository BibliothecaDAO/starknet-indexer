import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "./../../context";
import { Building } from "./../../entities";

@Resolver((_of) => Building)
export class BuildingResolver {
  @Query((_returns) => Building, { nullable: false })
  async getBuilding(@Arg("id") id: number, @Ctx() ctx: Context) {
    return await ctx.prisma.building.findUnique({
      where: { id }
    });
  }

  @Query(() => [Building])
  async getBuildings(@Ctx() ctx: Context) {
    return await ctx.prisma.building.findMany();
  }

  @Query(() => [Building])
  async getBuildingsByRealm(
    @Ctx() ctx: Context,
    @Arg("realmId") realmId: number
  ) {
    return await ctx.prisma.building.findMany({
      where: {
        realmId: realmId
      }
    });
  }

  @Query(() => [Building])
  async getBuildingsByAddress(
    @Ctx() ctx: Context,
    @Arg("address") address: string
  ) {
    return await ctx.prisma.building.findMany({
      where: {
        realm: {
          owner: address
        }
      }
    });
  }
}
