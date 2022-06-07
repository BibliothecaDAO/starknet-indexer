import { Resolver, Arg, Query, Ctx, FieldResolver, Root } from "type-graphql";
import { Context } from "../../context";
import { Realm, RealmHistory } from "../../entities";
import { RealmHistoryWhereInput } from "@generated/type-graphql";

@Resolver((_of) => RealmHistory)
export class RealmHistoryResolver {
  @Query(() => [RealmHistory])
  async realmHistory(
    @Ctx() ctx: Context,
    @Arg("filter", { nullable: true }) filter: RealmHistoryWhereInput,
    @Arg("take", { nullable: true, defaultValue: 20 }) take: number,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number
  ) {
    return await ctx.prisma.realmHistory.findMany({
      where: filter,
      take,
      skip,
      orderBy: { eventId: "desc" }
    });
  }

  @FieldResolver(() => Realm)
  async realm(@Ctx() ctx: Context, @Root() realmHistory: RealmHistory) {
    return await ctx.prisma.realm.findUnique({
      where: { realmId: realmHistory.realmId }
    });
  }
}
