import { LorePoi } from "../../entities/lore/LorePOI";
import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "../../context";

// import { DesiegeQueryOpts } from "../types/DesiegeInput";

@Resolver()
export class LorePOIResolver {
  @Query((_returns) => [LorePoi], { nullable: false })
  async getLorePois(
    @Ctx() ctx: Context,
    @Arg("take", { nullable: true, defaultValue: 100 }) take: number,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number
  ) {
    return await ctx.prisma.lorePOI.findMany({
      // orderBy: { id: "asc" },
      // include: { revisions: { orderBy: { revisionNumber: "desc" }, take: 1 } },
      take,
      skip
    });
  }
}
