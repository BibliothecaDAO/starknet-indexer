import {
  Resolver,
  Arg,
  Mutation,
  Query,
  Ctx,
} from 'type-graphql';
import { Context } from '../context'

import { Realm } from '../entities/Realm';
import { RealmInput } from './types/realm-input';

@Resolver((_of) => Realm)
export class RealmResolver {
  @Query((_returns) => Realm, { nullable: false })
  async returnSingleRealm(@Arg('id') id: number, @Ctx() ctx: Context) {
    return await ctx.prisma.realm.findUnique({
      where: { id },
    })
  }

  @Query(() => [Realm])
  async returnAllRealms(@Ctx() ctx: Context) {
    return await ctx.prisma.realm.findMany();
  }

  @Mutation(() => Realm)
  async createRealm(
    @Arg('data')
    data: RealmInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.realm.create({
      data: {
        name: data.name,
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
