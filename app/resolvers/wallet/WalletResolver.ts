import { ResourceId } from "../../utils/game_constants";
import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "./../../context";
import { Wallet, TokenBalance } from "./../../entities";
import { WalletInput } from "./../types";
import { parseEther } from "ethers/lib/utils";

@Resolver((_of) => Wallet)
export class WalletResolver {
  // @Query((_returns) => Wallet, { nullable: false })
  async getWallet(@Arg("address") address: string, @Ctx() ctx: Context) {
    const wallet = new Wallet();
    wallet.address = address;

    const [realmsL1Held, realmsL2Held, realmsBridgedHeld, realmsSettledHeld] =
      await Promise.all([
        ctx.prisma.realm.count({ where: { owner: address } }),
        ctx.prisma.realm.count({ where: { ownerL2: address } }),
        ctx.prisma.realm.count({ where: { bridgedOwner: address } }),
        ctx.prisma.realm.count({ where: { settledOwner: address } }),
      ]);

    wallet.realmsL1Held = realmsL1Held;
    wallet.realmsL2Held = realmsL2Held;
    wallet.realmsBridgedHeld = realmsBridgedHeld;
    wallet.realmsSettledHeld = realmsSettledHeld;
    return wallet;
  }

  @Query((_returns) => [TokenBalance], { nullable: false })
  async tokenBalances(@Arg("address") address: string, @Ctx() ctx: Context) {
    if (!address) {
      return [];
    }
    const [lordsToValues, lordsFromValues, toValues, fromValues] =
      await Promise.all([
        ctx.prisma.lordTransfer.groupBy({
          by: ["toAddress"],
          where: { toAddress: address },
          _sum: { amountValue: true },
        }),
        ctx.prisma.lordTransfer.groupBy({
          by: ["fromAddress"],
          where: { fromAddress: address },
          _sum: { amountValue: true },
        }),
        ctx.prisma.resourceTransfer.groupBy({
          by: ["resourceId"],
          where: { toAddress: address },
          _sum: { amountValue: true },
        }),
        ctx.prisma.resourceTransfer.groupBy({
          by: ["resourceId"],
          where: { fromAddress: address },
          _sum: { amountValue: true },
        }),
      ]);
    return [
      // Lords Amount
      {
        address,
        tokenId: 0,
        amount: parseEther(String(lordsToValues[0]?._sum?.amountValue ?? 0))
          .sub(parseEther(String(lordsFromValues[0]?._sum?.amountValue ?? 0)))
          .toString(),
      },
      // Resources
      ...Object.values(ResourceId).map((tokenId) => {
        const toAmount =
          toValues?.find((o) => o.resourceId === tokenId)?._sum?.amountValue ??
          0;
        const fromAmount =
          fromValues?.find((o) => o.resourceId === tokenId)?._sum
            ?.amountValue ?? 0;

        return {
          address,
          tokenId,
          amount: parseEther(String(toAmount))
            .sub(parseEther(String(fromAmount)))
            .toString(),
        };
      }),
    ];
  }

  async createOrUpdateWallet(data: WalletInput, ctx: Context) {
    return ctx.prisma.wallet.upsert({
      where: {
        address: data.address,
      },
      update: {
        address: data.address,
      },
      create: {
        address: data.address,
      },
    });
  }
}
