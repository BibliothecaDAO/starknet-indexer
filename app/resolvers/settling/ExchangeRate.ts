import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
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

    // Current Rates
    const rates = await ctx.prisma.exchangeRate.findMany({
      where: { date: current?.date, hour: current?.hour },
      orderBy: { tokenId: "asc" }
    });

    // Previous Rates
    const previousDay = current?.date ? new Date(current?.date) : new Date();
    previousDay.setDate(previousDay.getDate() - 1);
    const previousDate = previousDay.toISOString().split("T")[0];
    const previous = await ctx.prisma.exchangeRate.findFirst({
      where: {
        OR: [
          { date: previousDate, hour: { lte: current?.hour } },
          { date: { gt: previousDate } }
        ]
      },
      orderBy: [{ date: "asc" }, { hour: "asc" }]
    });

    const previousRates = await ctx.prisma.exchangeRate.findMany({
      where: {
        date: previous?.date,
        hour: previous?.hour
      }
    });

    // Calculate 24hr % Change
    for (let i = 0; i < rates.length; i++) {
      const rate = rates[i];
      const prev = previousRates.find((r) => r.tokenId === rate.tokenId);
      const previousAmount = prev?.amount;
      if (
        !previousAmount ||
        previousAmount === "0" ||
        rate.amount === previousAmount
      ) {
        (rate as ExchangeRate).percentChange24Hr = 0;
      } else {
        const current = +formatEther(BigNumber.from(rate.amount));
        const previous = +formatEther(BigNumber.from(previousAmount));
        const diff = current - previous;
        try {
          (rate as ExchangeRate).percentChange24Hr = diff / previous;
        } catch (e) {
          (rate as ExchangeRate).percentChange24Hr = 0;
        }
      }
    }

    return rates;
  }
}
