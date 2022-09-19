import { Context } from "../../context";
import { Resolver, Query, Ctx, Root, Arg, FieldResolver } from "type-graphql";
import { Army, BattalionCost, BattalionStats, Realm } from "../../entities";
import {
  ArmyWhereInput,
  ArmyOrderByWithRelationInput
} from "@generated/type-graphql";
import * as CONSTANTS from "../../utils/game_constants";

@Resolver((_of) => Army)
export class ArmyResolver {
  private _battalionCosts: BattalionCost[];
  // private allBattalionIds: number[];

  constructor() {
    const battalionNames = Object.keys(CONSTANTS.BattalionId);
    this._battalionCosts = battalionNames.map((battalionName) => {
      const battalionCost =
        CONSTANTS.BattalionCost[battalionName as CONSTANTS.BattalionName];
      return {
        battalionId:
          CONSTANTS.BattalionId[battalionName as CONSTANTS.BattalionName],
        battalionName,
        ...battalionCost
      };
    });
  }

  @Query(() => [Army])
  async armies(
    @Ctx() ctx: Context,
    @Arg("where", { nullable: true }) where: ArmyWhereInput,
    @Arg("orderBy", { nullable: true }) orderBy: ArmyOrderByWithRelationInput,
    @Arg("take", { nullable: true, defaultValue: 100 }) take: number,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number
  ) {
    const data = await ctx.prisma.army.findMany({
      where,
      orderBy,
      take,
      skip
    });
    return data;
  }

  @FieldResolver(() => Realm)
  async destinationRealm(@Ctx() ctx: Context, @Root() army: Army) {
    if (!army.destinationRealmId) {
      return null;
    }
    return ctx.prisma.realm.findUnique({
      where: { realmId: army.destinationRealmId }
    });
  }

  @Query(() => [BattalionStats])
  async battalionStats() {
    return CONSTANTS.BattalionStats;
  }

  @Query(() => [BattalionCost])
  async battalionCosts() {
    return this._battalionCosts;
  }
}
