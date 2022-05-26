import { Resolver, Query, Ctx } from "type-graphql";
import { Context } from "../../context";

import { ExchangePrice } from "../../entities";

@Resolver((_of) => ExchangePrice)
export class ExchangePriceResolver {
  @Query((_returns) => [ExchangePrice], { nullable: false })
  async getCurrentExchangePrices(@Ctx() ctx: Context) {
    const current = await ctx.prisma.exchangePrice.findFirst({
      orderBy: [{ date: "desc" }, { hour: "desc" }]
    });
    return await ctx.prisma.exchangePrice.findMany({
      where: {
        date: current?.date,
        hour: current?.hour
      },
      orderBy: { tokenId: "asc" }
    });
  }
}
