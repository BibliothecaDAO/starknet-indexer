import { Context } from "../../context";
import { parseEther } from "ethers/lib/utils";

import { ExchangeEventType } from "@prisma/client";
import { ResourceAmount } from "../../entities";
import { Ctx, Query } from "type-graphql";
const NULL_ADDRESS = "0x00";

export class EconomyResolver {
  @Query(() => [ResourceAmount])
  async economyResourceMintedTotals(@Ctx() ctx: Context) {
    const results = await ctx.prisma.resourceTransfer.groupBy({
      by: ["resourceId"],
      where: { fromAddress: NULL_ADDRESS },
      _sum: { amountValue: true },
      orderBy: { resourceId: "asc" },
    });
    return results.map((result: any) => {
      const value = result._sum.amountValue;
      return new ResourceAmount(
        result.resourceId,
        parseEther(String(value)).toString()
      );
    });
  }

  @Query(() => [ResourceAmount])
  async economyResourceBurnedTotals(@Ctx() ctx: Context) {
    const results = await ctx.prisma.resourceTransfer.groupBy({
      by: ["resourceId"],
      where: { toAddress: NULL_ADDRESS },
      _sum: { amountValue: true },
      orderBy: { resourceId: "asc" },
    });
    return results.map((result: any) => {
      const value = result._sum.amountValue;
      return new ResourceAmount(
        result.resourceId,
        parseEther(String(value)).toString()
      );
    });
  }

  @Query(() => [ResourceAmount])
  async economyLpResourceMintedTotals(@Ctx() ctx: Context) {
    const results = await ctx.prisma.exchangeEvent.groupBy({
      by: ["resourceId"],
      where: { type: ExchangeEventType.LiquidityAdded },
      _sum: { resourceAmountValue: true },
      orderBy: { resourceId: "asc" },
    });
    return results.map((result: any) => {
      const value = result._sum.resourceAmountValue;
      return new ResourceAmount(
        result.resourceId,
        parseEther(String(value)).toString()
      );
    });
  }

  @Query(() => [ResourceAmount])
  async economyLpResourceBurnedTotals(@Ctx() ctx: Context) {
    const results = await ctx.prisma.exchangeEvent.groupBy({
      by: ["resourceId"],
      where: { type: ExchangeEventType.LiquidityRemoved },
      _sum: { resourceAmountValue: true },
      orderBy: { resourceId: "asc" },
    });

    return results.map((result: any) => {
      const value = result._sum.resourceAmountValue;
      return new ResourceAmount(
        result.resourceId,
        parseEther(String(value)).toString()
      );
    });
  }

  @Query(() => String)
  async economyExchangeLordsPurchasedTotal(@Ctx() ctx: Context) {
    const result = await ctx.prisma.exchangeEvent.aggregate({
      where: { type: ExchangeEventType.CurrencyPurchased },
      _sum: { currencyAmountValue: true },
    });
    return parseEther(String(result._sum.currencyAmountValue)).toString();
  }

  @Query(() => [ResourceAmount])
  async economyExchangeResourcePurchasedTotals(@Ctx() ctx: Context) {
    const results = await ctx.prisma.exchangeEvent.groupBy({
      by: ["resourceId"],
      where: { type: ExchangeEventType.TokensPurchased },
      _sum: { resourceAmountValue: true },
      orderBy: { resourceId: "asc" },
    });
    return results.map((result: any) => {
      const value = result._sum.resourceAmountValue;
      return new ResourceAmount(
        result.resourceId,
        parseEther(String(value)).toString()
      );
    });
  }
}
