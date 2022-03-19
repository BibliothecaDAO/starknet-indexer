import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "../../context";

import { Desiege } from "../../entities/desiege/Desiege";
import { DesiegeInput } from "../types/desiege-input";

@Resolver((_of) => Desiege)
export class DesiegeResolver {
  @Query((_returns) => Desiege, { nullable: false })
  async getDesiege(@Arg("id") id: number, @Ctx() ctx: Context) {
    return await ctx.prisma.desiege.findUnique({
      where: { id }
    });
  }

  @Query(() => [Desiege])
  async getDesiegeGames(@Ctx() ctx: Context) {
    return await ctx.prisma.desiege.findMany({
      orderBy: {
        gameId: "desc"
      }
    });
  }

  @Mutation(() => Desiege)
  async createOrUpdateDesiege(
    @Arg("data")
    data: DesiegeInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.desiege.upsert({
      where: {
        gameId: data.gameId
      },
      update: {
        attackedTokens: {
          increment: data.attackedTokens
        },
        defendedTokens: {
          increment: data.defendedTokens
        },
        blockIndexed: data.blockIndexed
      },
      create: {
        gameId: data.gameId,
        attackedTokens: data.attackedTokens,
        defendedTokens: data.defendedTokens,
        blockIndexed: data.blockIndexed
      }
    });
  }

  @Mutation(() => Boolean)
  async reindexDesiege(@Ctx() ctx: Context) {
    await ctx.prisma.desiege.deleteMany();
    return true;
  }
}
