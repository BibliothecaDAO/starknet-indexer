import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "../../context";
import { Realm } from "../../entities";
import { RealmInput } from "../types";
import { RealmFilterInput, RealmOrderByInput } from "../types/settling";

@Resolver((_of) => Realm)
export class RealmResolver {
  @Query((_returns) => Realm, { nullable: false })
  async getRealm(@Arg("realmId") realmId: number, @Ctx() ctx: Context) {
    return await ctx.prisma.realm.findUnique({
      where: { realmId: realmId },
      include: {
        buildings: true,
        traits: true,
        resources: true,
        squads: true,
        wallet: true
      }
    });
  }

  getRealmFilter(filter: RealmFilterInput) {
    const where = {} as any;
    const keys = Object.keys(filter ?? {});

    for (let key of keys) {
      const value = (filter as any)[key];
      if (value) {
        switch (key) {
          case "buildingType":
            where.buildings = { some: { type: filter.buildingType } };
            break;
          case "squadType":
            where.squads = { some: { type: filter.squadType } };
            break;
          case "resourceType":
            where.resources = { some: { type: filter.resourceType } };
            break;
          case "trait":
            where.traits = { some: filter.trait };
            break;
          case "squadAction":
            where.squads = { some: { type: filter.squadAction } };
            break;
          case "AND":
            where.AND = filter.AND?.map((filter) =>
              this.getRealmFilter(filter)
            );
            break;
          case "OR":
            where.OR = filter.OR?.map((filter) => this.getRealmFilter(filter));
            break;
          case "NOT":
            where.NOT = filter.NOT?.map((filter) =>
              this.getRealmFilter(filter)
            );
            break;
          default:
            where[key] = value;
            break;
        }
      }
    }
    return where;
  }

  @Query(() => [Realm])
  async getRealms(
    @Ctx() ctx: Context,
    @Arg("filter", { nullable: true }) filter: RealmFilterInput,
    @Arg("orderBy", { nullable: true }) orderBy: RealmOrderByInput,
    @Arg("take", { nullable: true, defaultValue: 100 }) take: number,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number
  ) {
    return await ctx.prisma.realm.findMany({
      where: this.getRealmFilter(filter),
      include: {
        buildings: true,
        traits: true,
        resources: true,
        squads: true,
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
      bridgedOwner: data.bridgedOwner,
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
