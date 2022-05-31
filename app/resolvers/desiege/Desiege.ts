import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "./../../context";

import { Desiege } from "./../../entities";
// import { DesiegeQueryOpts } from "./../types/DesiegeInput";

@Resolver((_of) => Desiege)
export class DesiegeResolver {
  @Query((_returns) => Desiege, { nullable: false })
  async getDesiege(@Arg("id") id: number, @Ctx() ctx: Context) {
    return await ctx.prisma.desiege.findUnique({
      where: { id }
    });
  }

  @Query((_returns) => Desiege, { nullable: false })
  async getDesiegeCurrent(@Ctx() ctx: Context) {
    return await ctx.prisma.desiege.findFirst({
      orderBy: {
        gameId: "desc"
      }
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

  @Mutation(() => Boolean)
  async reindexDesiege(@Ctx() ctx: Context) {
    await ctx.prisma.desiege.deleteMany();
    return true;
  }
}
