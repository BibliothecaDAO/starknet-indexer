import {
    Resolver,
    Arg,
    Mutation,
    Query,
    Ctx,
} from 'type-graphql';
import { Context } from '../../context'
import { Wallet } from '../../entities/wallet/Wallet';
import { WalletInput } from '../types/wallet-input';

@Resolver((_of) => Wallet)
export class WalletResolver {
    @Query((_returns) => Wallet, { nullable: false })
    async returnSingleWallet(@Arg('address') address: string, @Ctx() ctx: Context) {
        return await ctx.prisma.wallet.findUnique({
            where: { address },
        })
    }

    @Query(() => [Wallet])
    async returnAllWallets(@Ctx() ctx: Context) {
        return await ctx.prisma.wallet.findMany({
            include: {
                realms: true,
            },
        });
    }

    @Mutation(() => Wallet)
    async createWallet(
        @Arg('data')
        data: WalletInput,
        @Ctx() ctx: Context
    ) {
        return ctx.prisma.wallet.upsert({
            where: {
                address: data.address,
            },
            update: {
                address: data.address
            },
            create: {
                address: data.address
            },
        })
    }

    // @Mutation(() => Boolean)
    // async deleteProduct(@Arg('id') id: string) {
    //   await ProductModel.deleteOne({ id });
    //   return true;
    // }

    // @FieldResolver((_type) => Categories)
    // async category(@Root() product: Product): Promise<Categories> {
    //   console.log(product, 'product!');
    //   return (await CategoriesModel.findById(product._doc.category_id))!;
    // }
}
