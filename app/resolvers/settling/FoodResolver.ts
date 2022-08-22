import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "./../../context";
import { Food } from "./../../entities";

@Resolver((_of) => Food)
export class FoodResolver {
  @Query(() => [Food])
  async getFoodByRealmId(@Ctx() ctx: Context, @Arg("id") id: number) {
    return await ctx.prisma.food.findMany({ where: { realmId: id } });
  }
}
