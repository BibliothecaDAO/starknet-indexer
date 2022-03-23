import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "../../context";
import { Realm } from "../../entities";
import { RealmInput } from "../types";

@Resolver((_of) => Realm)
export class RealmResolver {
  @Query((_returns) => Realm, { nullable: false })
  async getRealm(@Arg("id") id: number, @Ctx() ctx: Context) {
    return await ctx.prisma.realm.findUnique({
      where: { id },
      include: {
        buildings: true,
        traits: true,
        resources: true,
        wallet: true
      }
    });
  }

  @Query(() => [Realm])
  async getRealms(@Ctx() ctx: Context) {
    return await ctx.prisma.realm.findMany({
      include: {
        buildings: true,
        traits: true,
        resources: true,
        wallet: true
      }
    });
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
