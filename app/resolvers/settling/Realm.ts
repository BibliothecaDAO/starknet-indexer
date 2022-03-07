import {
  Resolver,
  Arg,
  Mutation,
  Query,
  Ctx,
} from 'type-graphql';
import { Context } from '../../context'
import { Realm } from '../../entities';
import { RealmInput } from '../types';

@Resolver((_of) => Realm)
export class RealmResolver {
  @Query((_returns) => Realm, { nullable: false })
  async getRealm(@Arg('id') id: number, @Ctx() ctx: Context) {
    return await ctx.prisma.realm.findUnique({
      where: { id },
    })
  }

  @Query(() => [Realm])
  async getRealms(@Ctx() ctx: Context) {
    return await ctx.prisma.realm.findMany();
  }

  @Mutation(() => Realm)
  async createOrUpdateRealm(
    @Arg('data')
    data: RealmInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.realm.upsert({
      where: {
        realmId: data.realmId
      },
      update: {
        name: data.name,
        realmId: data.realmId,
        wallet: {
          connect: { address: data.owner }
        }
      },
      create: {
        name: data.name,
        realmId: data.realmId,
        wallet: {
          connect: { address: data.owner }
        }
      },
    })
  }
}
