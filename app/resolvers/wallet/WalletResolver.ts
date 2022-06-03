import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "./../../context";
import { Wallet } from "./../../entities";
import { WalletInput } from "./../types";

@Resolver((_of) => Wallet)
export class WalletResolver {
  @Query((_returns) => Wallet, { nullable: false })
  async getWallet(@Arg("address") address: string, @Ctx() ctx: Context) {
    const wallet = new Wallet();
    wallet.address = address;

    const [realmsL1Held, realmsL2Held, realmsBridgedHeld, realmsSettledHeld] =
      await Promise.all([
        ctx.prisma.realm.count({ where: { owner: address } }),
        ctx.prisma.realm.count({ where: { ownerL2: address } }),
        ctx.prisma.realm.count({ where: { bridgedOwner: address } }),
        ctx.prisma.realm.count({ where: { settledOwner: address } })
      ]);

    wallet.realmsL1Held = realmsL1Held;
    wallet.realmsL2Held = realmsL2Held;
    wallet.realmsBridgedHeld = realmsBridgedHeld;
    wallet.realmsSettledHeld = realmsSettledHeld;
    return wallet;
  }

  async createOrUpdateWallet(data: WalletInput, ctx: Context) {
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
