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
                gameId: data.gameId,
            },
            update: {
                attackedTokens: {
                    increment: data.attackedTokens,
                },
                defendedTokens: {
                    increment: data.defendedTokens,
                }
            },
            create: {
                gameId: data.gameId,
                attackedTokens: data.attackedTokens,
                defendedTokens: data.defendedTokens,
            },
        });
    }
}
