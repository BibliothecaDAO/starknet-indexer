import { Resolver, Query, Ctx } from "type-graphql";
import { Context } from "../../context";

import { ExchangeRate } from "../../entities";

@Resolver((_of) => ExchangeRate)
export class ExchangeRateResolver {
  @Query((_returns) => [ExchangeRate], { nullable: false })
  async getExchangeRates(@Ctx() ctx: Context) {
    const current = await ctx.prisma.exchangeRate.findFirst({
      orderBy: [{ date: "desc" }, { hour: "desc" }]
    });
    return await ctx.prisma.exchangeRate.findMany({
      where: {
        date: current?.date,
        hour: current?.hour
      },
      orderBy: { tokenId: "asc" }
    });
  }
}
