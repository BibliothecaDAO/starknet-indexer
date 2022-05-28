import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "../../context";
import { Realm } from "../../entities";
import { RealmInput } from "../types";
import { RealmOrderByInput } from "../types/settling";
import { RealmWhereInput } from "@generated/type-graphql";

@Resolver((_of) => Realm)
export class RealmResolver {
  @Query((_returns) => Realm, { nullable: false })
  async getRealm(@Arg("realmId") realmId: number, @Ctx() ctx: Context) {
    const data = await ctx.prisma.realm.findUnique({
      where: { realmId: realmId },
      include: {
        buildings: true,
        traits: true,
        resources: true,
        wallet: true,
        squad: true
      }
    });
    return data;
  }

  @Query(() => [Realm])
  async getRealms(
    @Ctx() ctx: Context,
    @Arg("filter", { nullable: true }) filter: RealmWhereInput,
    @Arg("orderBy", { nullable: true }) orderBy: RealmOrderByInput,
    @Arg("take", { nullable: true, defaultValue: 100 }) take: number,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number
  ) {
    const data = await ctx.prisma.realm.findMany({
      where: filter,
      include: {
        buildings: true,
        traits: true,
        resources: true,
        wallet: true
      },
      orderBy: orderBy
        ? Object.keys(orderBy).map((key: any) => ({
            [key]: (orderBy as any)[key]
          }))
        : undefined,
      take,
      skip
    });
    return data;
  }

  @Mutation(() => Realm)
  async createOrUpdateRealm(
    @Arg("data")
    data: RealmInput,
    @Ctx() ctx: Context
  ) {
    const updates = {
      name: data.name,
      realmId: data.realmId,
      owner: data.owner,
      rarityRank: data.rarityRank,
      rarityScore: data.rarityScore,
      wonder: data.wonder,
      orderType: data.orderType,
      imageUrl: data.imageUrl
    };
    return ctx.prisma.realm.upsert({
      where: {
        realmId: data.realmId
      },
      update: {
        ...updates
      },
      create: {
        ...updates
      }
    });
  }
}
