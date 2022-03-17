import {
    Resolver,
    Arg,
    Mutation,
    Query,
    Ctx,
} from 'type-graphql';
import { Context } from '../../context'
import { Buildings } from '../../entities';
import { BuildingsInput } from '../types';

@Resolver((_of) => Buildings)
export class BuildingsResolver {
    @Query((_returns) => Buildings, { nullable: false })
    async getBuildings(@Arg('id') id: number, @Ctx() ctx: Context) {
        return await ctx.prisma.buildings.findUnique({
            where: { id },
        })
    }

    @Query(() => [Buildings])
    async getAllBuildings(@Ctx() ctx: Context) {
        return await ctx.prisma.buildings.findMany();
    }

    @Mutation(() => Buildings)
    async createOrUpdateBuildings(
        @Arg('data')
        data: BuildingsInput,
        @Ctx() ctx: Context
    ) {
        return ctx.prisma.buildings.upsert({
            where: {
                realmId: data.realmId
            },
            update: {
                barracks: data.barracks,
            },
            create: {
                barracks: data.barracks,
                realm: {
                    connect: { realmId: data.realmId }
                }
            },
        })
    }
}
