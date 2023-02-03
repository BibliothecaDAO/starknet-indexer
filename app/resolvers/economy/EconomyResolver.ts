import { Context } from "../../context";
import { parseEther } from "ethers/lib/utils";

import { ExchangeEventType } from "@prisma/client";
import {
  ResourceAmount,
  ResourceAmountByBattalion,
  ResourceAmountByBuilding,
} from "../../entities";
import { Ctx, Int, Query } from "type-graphql";
import { CONTRACT as BUILDING_CONTRACT } from "../../indexer/settling/BuildingIndexer";
import { CONTRACT as COMBAT_CONTRACT } from "../../indexer/settling/CombatIndexer";
import { CONTRACT as LABOR_CONTRACT } from "../../indexer/settling/LaborIndexer";
import {
  BuildingNameById,
  BuildingCost,
  BattalionCost,
  BattalionId,
} from "../../utils/game_constants";
import { BigNumber } from "ethers";

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

  // Building Queries
  @Query(() => [ResourceAmount])
  async economyResourceBurnedTotalsByBuildingAll(@Ctx() ctx: Context) {
    return this.economyResourceBurnedByContractTotals(ctx, BUILDING_CONTRACT);
  }

  @Query(() => [ResourceAmountByBuilding])
  async economyResourceBurnedTotalsByBuildingId(@Ctx() ctx: Context) {
    const results = await ctx.prisma.buildBuildingEvent.groupBy({
      by: ["buildingId"],
      _sum: { count: true },
      orderBy: { buildingId: "asc" },
    });
    return results
      .map((result) => {
        const name = BuildingNameById[result.buildingId];
        const cost = (BuildingCost as any)[name] as any;
        if (!cost) {
          return [];
        }
        return cost.resources
          .map((resource: any) => {
            if (!result._sum?.count) return null;
            return new ResourceAmountByBuilding(
              result.buildingId,
              resource.resourceId,
              BigNumber.from(parseEther(resource.amount + ""))
                .mul(result._sum?.count)
                .toString()
            );
          })
          .filter(Boolean);
      })
      .flat();
  }

  // Battalions
  @Query(() => [ResourceAmount])
  async economyResourceBurnedTotalsByBattalionAll(@Ctx() ctx: Context) {
    return this.economyResourceBurnedByContractTotals(ctx, COMBAT_CONTRACT);
  }

  @Query(() => [ResourceAmountByBattalion])
  async economyResourceBurnedTotalsByBattalionId(@Ctx() ctx: Context) {
    // IDS are 1-7, if this changes, update logic
    const keys = [
      "lightCavalryQty",
      "heavyCavalryQty",
      "archerQty",
      "longbowQty",
      "mageQty",
      "arcanistQty",
      "lightInfantryQty",
      "heavyInfantryQty",
    ];
    const result = await ctx.prisma.buildArmyEvent.aggregate({
      _sum: {
        ...keys.reduce((result, val) => ({ ...result, [val]: true }), {}),
      },
    });
    return Object.keys(BattalionId)
      .map((battalionName) => {
        const battalionId = (BattalionId as any)[battalionName] as number;
        const cost = (BattalionCost as any)[battalionName];
        return cost.resources.map((resource: any) => {
          const key = keys[battalionId - 1] ?? "";
          const amount = BigNumber.from(parseEther(resource.amount + ""))
            .mul((result._sum as any)[key] ?? 0)
            .toString();
          return new ResourceAmountByBattalion(
            battalionId,
            resource.resourceId,
            amount
          );
        });
      })
      .flat();
  }

  @Query(() => [ResourceAmount])
  async economyResourceBurnedTotalsByLaborAll(@Ctx() ctx: Context) {
    return this.economyResourceBurnedByContractTotals(ctx, LABOR_CONTRACT);
  }

  async economyResourceBurnedByContractTotals(ctx: Context, contract: string) {
    const results = await ctx.prisma.resourceTransfer.groupBy({
      by: ["resourceId"],
      where: {
        toAddress: NULL_ADDRESS,
        operatorAddress: contract,
      },
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

  @Query(() => Int)
  async economySettledRealmsTotal(@Ctx() ctx: Context) {
    return await ctx.prisma.realm.count({
      where: {
        AND: [
          { settledOwner: { not: null } },
          { settledOwner: { not: "0x00" } },
        ],
      },
    });
  }
}
