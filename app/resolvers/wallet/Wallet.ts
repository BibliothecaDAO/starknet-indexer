import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "../../context";
import { Wallet } from "../../entities";
import { WalletInput } from "../types";

@Resolver((_of) => Wallet)
export class WalletResolver {
  @Query((_returns) => Wallet, { nullable: false })
  async getWallet(@Arg("address") address: string, @Ctx() ctx: Context) {
    return await ctx.prisma.wallet.findUnique({
      where: { address }
    });
  }

  @Query(() => [Wallet])
  async getWallets(@Ctx() ctx: Context) {
    return await ctx.prisma.wallet.findMany({
      include: {
        realms: true
      }
    });
  }

  @Mutation(() => Wallet)
  async createOrUpdateWallet(
    @Arg("data")
    data: WalletInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.wallet.upsert({
      where: {
        address: data.address
      },
      update: {
        address: data.address
      },
      create: {
        address: data.address
      }
    });
  }
}
