import {
    Resolver,
    Arg,
    Mutation,
    Query,
    Ctx,
} from 'type-graphql';
import { Context } from '../context'

import { Desiege } from '../entities/Desiege';
import { DesiegeInput } from './types/desiege-input';

@Resolver((_of) => Desiege)
export class DesiegeResolver {
    // @Query((_returns) => Realm, { nullable: false })
    // async returnSingleRealm(@Arg('id') id: number, @Ctx() ctx: Context) {
    //     return await ctx.prisma.realm.findUnique({
    //         where: { id },
    //     })
    // }

    @Query(() => [Desiege])
    async returnAllDesiegeGames(@Ctx() ctx: Context) {
        return await ctx.prisma.desiege.findMany();
    }

    @Mutation(() => Desiege)
    async createDesiegeGame(
        @Arg('data')
        data: DesiegeInput,
        @Ctx() ctx: Context
    ) {
        return ctx.prisma.desiege.create({
            data: {
                winner: data.winner,
                attackedTokens: data.attackedTokens,
                defendedTokens: data.defendedTokens,
                totalDamage: data.totalDamage,
                totalShieldBoost: data.totalShieldBoost
            },
        })
    }
}
