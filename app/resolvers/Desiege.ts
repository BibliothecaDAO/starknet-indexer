import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import { Context } from "../context";

import { Desiege } from "../entities/Desiege";
import { DesiegeInput } from "./types/desiege-input";

@Resolver((_of) => Desiege)
export class DesiegeResolver {
    @Query((_returns) => Desiege, { nullable: false })
    async returnSingleDesiege(@Arg('id') id: number, @Ctx() ctx: Context) {
        return await ctx.prisma.desiege.findUnique({
            where: { id },
        })
    }

    @Query(() => [Desiege])
    async returnAllDesiegeGames(@Ctx() ctx: Context) {
        return await ctx.prisma.desiege.findMany();
    }

    @Mutation(() => Desiege)
    async createOrUpdateDesiegeGame(
        @Arg("data")
        data: DesiegeInput,
        @Ctx() ctx: Context
    ) {
        return ctx.prisma.desiege.upsert({
            where: {
                id: data.id,
            },
            update: {
                winner: data.winner,
                attackedTokens: {
                    increment: data.attackedTokens,
                },
                defendedTokens: {
                    increment: data.defendedTokens,
                },
                totalDamage: {
                    increment: data.totalDamage
                },
                totalShieldBoost: {
                    increment: data.totalShieldBoost
                },
            },
            create: {
                winner: data.winner,
                attackedTokens: data.attackedTokens,
                defendedTokens: data.defendedTokens,
                totalDamage: data.totalDamage,
                totalShieldBoost: data.totalShieldBoost,
            },
        });
    }
}
