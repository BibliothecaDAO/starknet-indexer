import { FindManyTravelResolver, Travel } from "@generated/type-graphql";
import { Context } from "../../context";
import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Realm } from "../../entities";
import { ExternalContractId } from "../../utils/game_constants";

@Resolver((_of) => Travel)
export class TravelResolver extends FindManyTravelResolver {
  @FieldResolver(() => Realm, { nullable: true })
  async originRealm(@Ctx() ctx: Context, @Root() travel: Travel) {
    if (travel.contractId !== ExternalContractId.S_Realms) {
      return null;
    }
    return await ctx.prisma.realm.findUnique({
      where: { realmId: travel.tokenId }
    });
  }

  @FieldResolver(() => Realm, { nullable: true })
  async destinationRealm(@Ctx() ctx: Context, @Root() travel: Travel) {
    if (travel.destinationContractId !== ExternalContractId.S_Realms) {
      return null;
    }
    return await ctx.prisma.realm.findUnique({
      where: { realmId: travel.destinationTokenId }
    });
  }
}
