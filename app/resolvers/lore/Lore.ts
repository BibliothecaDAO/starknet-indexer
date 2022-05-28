import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "../../context";

import { LoreEntity } from "../../entities";
import { LoreEntityWhereInput } from "@generated/type-graphql";

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
    @Arg("filter", { nullable: true }) filter: LoreEntityWhereInput,
    @Arg("take", { nullable: true, defaultValue: 100 }) take: number,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number
  ) {
    return await ctx.prisma.loreEntity.findMany({
      where: filter,
      orderBy: { id: "desc" },
      include: { revisions: { orderBy: { revisionNumber: "desc" }, take: 1 } },
      take,
      skip
    });
  }
}
