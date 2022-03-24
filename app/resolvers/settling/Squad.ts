import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "../../context";
import { Squad } from "../../entities";
import { SquadInput } from "../types";

@Resolver((_of) => Squad)
export class SquadResolver {
  @Query((_returns) => Squad, { nullable: false })
  @Query(() => [Squad])
  async getSquads(@Ctx() ctx: Context) {
    return await ctx.prisma.building.findMany();
  }

  @Query(() => [Squad])
  async getSquadsByRealm(@Ctx() ctx: Context, @Arg("realmId") realmId: number) {
    return await ctx.prisma.building.findMany({
      where: {
        realmId: realmId
      }
    });
  }

  @Query(() => [Squad])
  async getSquadsByAddress(
    @Ctx() ctx: Context,
    @Arg("address") address: string
  ) {
    return await ctx.prisma.squad.findMany({
      where: {
        realm: {
          owner: address
        }
      }
    });
  }

  @Mutation(() => Squad)
  async createOrUpdateSquad(
    @Arg("data")
    data: SquadInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.squad.upsert({
      where: {
        realmId_action: {
          realmId: data.realmId,
          action: data.action
        }
      },
      update: {
        type: data.type
      },
      create: {
        realmId: data.realmId,
        type: data.type,
        action: data.action
      }
    });
  }
}
