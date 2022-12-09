import {
  Resolver,
  Arg,
  Query,
  Ctx,
  Int,
  FieldResolver,
  Root,
} from "type-graphql";
import { Context } from "../../context";
import {
  Army,
  Realm,
  RealmHistory,
  CombatResult,
  ResourceAmount,
  Building,
  Resource,
  RealmTrait,
  Troop,
  Relic,
  Food,
} from "../../entities";
import { RealmInput } from "../types";
import { RealmOrderByInput } from "../types/settling";
import {
  RealmWhereInput,
  RealmHistoryWhereInput,
  RealmOrderByWithRelationInput,
} from "@generated/type-graphql";
import { Prisma } from "@prisma/client";

@Resolver((_of) => Realm)
export class RealmResolver {
  @Query(() => [Realm])
  async realms(
    @Ctx() ctx: Context,
    @Arg("filter", { nullable: true }) where: RealmWhereInput,
    @Arg("orderBy", { nullable: true }) orderBy: RealmOrderByWithRelationInput,
    @Arg("take", { nullable: true, defaultValue: 100 }) take: number,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number
  ) {
    const data = await ctx.prisma.realm.findMany({
      where,
      orderBy,
      take,
      skip,
    });
    return data;
  }

  @Query(() => Realm, { nullable: false })
  async realm(@Ctx() ctx: Context, @Arg("id") realmId: number) {
    return await ctx.prisma.realm.findFirst({
      where: { realmId },
    });
  }

  @FieldResolver(() => [Building])
  async buildings(@Ctx() ctx: Context, @Root() realm: Realm) {
    return await ctx.prisma.building.findMany({
      where: { realmId: realm.realmId },
    });
  }

  @FieldResolver(() => [Food])
  async foods(@Ctx() ctx: Context, @Root() realm: Realm) {
    return await ctx.prisma.food.findMany({
      where: { realmId: realm.realmId },
    });
  }

  @FieldResolver(() => [Resource])
  async resources(@Ctx() ctx: Context, @Root() realm: Realm) {
    return await ctx.prisma.resource.findMany({
      where: { realmId: realm.realmId },
    });
  }

  @FieldResolver(() => [RealmTrait])
  async traits(@Ctx() ctx: Context, @Root() realm: Realm) {
    return await ctx.prisma.realmTrait.findMany({
      where: { realmId: realm.realmId },
    });
  }

  @FieldResolver(() => [Troop])
  async troops(@Ctx() ctx: Context, @Root() realm: Realm) {
    return await ctx.prisma.troop.findMany({
      where: { realmId: realm.realmId },
    });
  }

  @FieldResolver(() => [Army])
  async ownArmies(@Ctx() ctx: Context, @Root() realm: Realm) {
    return await ctx.prisma.army.findMany({
      where: { realmId: realm.realmId },
      orderBy: { armyId: "asc" },
    });
  }

  @FieldResolver(() => Relic)
  async relic(@Ctx() ctx: Context, @Root() realm: Realm) {
    return await ctx.prisma.relic.findMany({
      where: { realmId: realm.realmId },
    });
  }
  @FieldResolver(() => [Relic])
  async relicsOwned(@Ctx() ctx: Context, @Root() realm: Realm) {
    return await ctx.prisma.relic.findMany({
      where: { heldByRealm: realm.realmId },
    });
  }
  @Query(() => Int)
  async realmsCount(
    @Ctx() ctx: Context,
    @Arg("filter", { nullable: true }) where: RealmWhereInput
  ) {
    return await ctx.prisma.realm.count({ where });
  }

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
      orderBy: { eventId: "desc" },
    });
  }

  @Query(() => CombatResult)
  async realmCombatHistory(
    @Ctx() ctx: Context,
    @Arg("defendRealmId") defendRealmId: number,
    @Arg("transactionHash") transactionHash: string
  ) {
    const realmHistory = await ctx.prisma.realmHistory.findFirst({
      where: {
        realmId: defendRealmId,
        eventType: "realm_combat_defend",
        transactionHash,
      },
      orderBy: { eventId: "asc" },
    });

    const realmHistoryData = realmHistory?.data as Prisma.JsonObject;
    const result = new CombatResult();
    result.defendRealmId = defendRealmId;
    result.attackRealmId = realmHistoryData?.attackRealmId as number;
    result.transactionHash = transactionHash;
    result.history = [];
    result.resourcesPillaged =
      realmHistoryData?.pillagedResources as unknown as ResourceAmount[];
    result.relicLost = (realmHistoryData?.relicLost as number) ?? 0;
    result.outcome = (realmHistoryData?.success as boolean) ? 2 : 1;
    result.timestamp = realmHistory?.timestamp as Date;
    return result;
  }

  // BELOW DEPRECATED

  @Query((_returns) => Realm, { nullable: false })
  async getRealm(@Arg("realmId") realmId: number, @Ctx() ctx: Context) {
    const data = await ctx.prisma.realm.findUnique({
      where: { realmId: realmId },
      include: {
        buildings: true,
        traits: true,
        resources: true,
        wallet: true,
        squad: true,
        ownArmies: true,
      },
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
        wallet: true,
        squad: true,
        ownArmies: true,
      },
      orderBy: orderBy
        ? Object.keys(orderBy).map((key: any) => ({
            [key]: (orderBy as any)[key],
          }))
        : undefined,
      take,
      skip,
    });
    return data;
  }

  @Query(() => [RealmHistory])
  async getRealmHistory(
    @Ctx() ctx: Context,
    @Arg("filter", { nullable: true }) filter: RealmHistoryWhereInput,
    @Arg("take", { nullable: true, defaultValue: 20 }) take: number,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number
  ) {
    return await ctx.prisma.realmHistory.findMany({
      where: filter,
      take,
      skip,
      orderBy: { eventId: "desc" },
    });
  }

  @Query(() => CombatResult)
  async getRealmCombatResult(
    @Ctx() ctx: Context,
    @Arg("defendRealmId") defendRealmId: number,
    @Arg("transactionHash") transactionHash: string
  ) {
    const combatHistory = await ctx.prisma.combatHistory.findMany({
      where: {
        defendRealmId,
        transactionHash,
      },
      orderBy: { eventId: "asc" },
    });

    const eventId = combatHistory[0].eventId;
    const [blockNumber, transactionNumber] = eventId.split("_");
    const resources = await ctx.prisma.resourceTransfer.findMany({
      where: {
        blockNumber: parseInt(blockNumber),
        transactionNumber: parseInt(transactionNumber),
      },
    });

    // Check for relic
    let relicRealmId = 0;
    const outcomeEvent = combatHistory.find(
      (history) => history.eventType === "combat_outcome"
    );
    if (outcomeEvent) {
      const [blockNumber, transactionNumber, eventNumber] =
        outcomeEvent.eventId.split("_");
      // Relic wll be the event prior to the combat outcome event
      const previousEventNumber = parseInt(eventNumber) - 1;
      if (previousEventNumber > 0) {
        const relicEventId = [
          blockNumber,
          transactionNumber,
          String(previousEventNumber).padStart(4, "0"),
        ].join("_");
        const relicEvent = await ctx.prisma.realmHistory.findFirst({
          where: { eventId: relicEventId, eventType: "relic_update" },
        });
        if (relicEvent) {
          relicRealmId = relicEvent.realmId;
        }
      }
    }

    const result = new CombatResult();
    result.defendRealmId = defendRealmId;
    result.attackRealmId = combatHistory[0].attackRealmId;
    result.transactionHash = transactionHash;
    result.history = combatHistory;
    result.resourcesPillaged = resources.map((resource) => {
      const amount = new ResourceAmount();
      amount.resourceId = resource.resourceId;
      amount.amount = resource.amount;
      return amount;
    });
    result.relicLost = relicRealmId;
    result.outcome =
      combatHistory.find((event) => event.eventType === "combat_outcome")
        ?.outcome ?? 0;
    result.timestamp = combatHistory[combatHistory.length - 1]?.timestamp ?? 0;
    return result;
  }

  // @Mutation(() => Realm)
  async createOrUpdateRealm(
    // @Arg("data")
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
      imageUrl: data.imageUrl,
    };
    return ctx.prisma.realm.upsert({
      where: {
        realmId: data.realmId,
      },
      update: {
        ...updates,
      },
      create: {
        ...updates,
      },
    });
  }
}
