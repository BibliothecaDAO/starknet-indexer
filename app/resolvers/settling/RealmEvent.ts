import { Resolver, Query, Ctx, Arg } from "type-graphql";
import { Context } from "../../context";
import { RealmEvent } from "../../entities/settling/RealmEvent";
import { RealmEventWhereInput } from "@generated/type-graphql";

@Resolver((_of) => RealmEvent)
export class RealmEventResolver {
  @Query(() => [RealmEvent])
  async getRealmEvents(
    @Ctx() ctx: Context,
    @Arg("filter", { nullable: true }) filter: RealmEventWhereInput,
    @Arg("take", { nullable: true, defaultValue: 20 }) take: number,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number
  ) {
    return await ctx.prisma.realmEvent.findMany({
      where: filter,
      take,
      skip,
      orderBy: { eventId: "desc" }
    });
  }
}
