import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "./../../context";
import { RealmTrait } from "./../../entities";
import { RealmTraitInput } from "./../types";

@Resolver((_of) => RealmTrait)
export class RealmTraitResolver {
  @Query(() => [RealmTrait])
  async getRealmTraits(@Ctx() ctx: Context) {
    return await ctx.prisma.realmTrait.findMany();
  }

  @Mutation(() => RealmTrait)
  async createOrUpdateRealmTrait(
    @Arg("data")
    data: RealmTraitInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.realmTrait.upsert({
      where: {
        type_realmId: {
          realmId: data.realmId,
          type: data.type
        }
      },
      update: {
        qty: data.qty
      },
      create: data
    });
  }
}
