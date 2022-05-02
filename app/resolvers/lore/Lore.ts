import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "../../context";

import { LoreEntity } from "../../entities";
// import { DesiegeQueryOpts } from "../types/DesiegeInput";

@Resolver()
export class LoreResolver {
  @Query((_returns) => LoreEntity, { nullable: false })
  async getLoreEntity(
    @Ctx() ctx: Context,
    @Arg("entityId") entityId: number,
    // @Arg("revisionNumber", { nullable: true, defaultValue: 0 }) revisionNumber: number
  ) {
    return await ctx.prisma.loreEntity.findFirst({
      where: {
        id: entityId
      },
      include: { revisions: { orderBy: { revisionNumber: "desc" }, take: 1 } },
    });
  }

  @Query((_returns) => [LoreEntity], { nullable: false })
  async getLoreEntities(
    @Ctx() ctx: Context,
    @Arg("take", { nullable: true, defaultValue: 100 }) take: number,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number
  ) {
    return await ctx.prisma.loreEntity.findMany({
      orderBy: { id: "desc" },
      include: { revisions: { orderBy: { revisionNumber: "desc" }, take: 1 } },
      take,
      skip
    });
  }

  // @Query(() => [Desiege])
  // async getDesiegeGames(
  //   @Ctx() ctx: Context
  //   // @Arg("opts", { nullable: true }) opts: DesiegeQueryOpts
  // ) {
  //   return await ctx.prisma.desiege.findMany({
  //     orderBy: {
  //       gameId: "desc"
  //     }
  //   });
  // }

  // @Mutation(() => Boolean)
  // async reindexDesiege(@Ctx() ctx: Context) {
  //   await ctx.prisma.desiege.deleteMany();
  //   return true;
  // }
}
