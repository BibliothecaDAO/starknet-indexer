import {
    Resolver,
    Arg,
    Mutation,
    Query,
    Ctx,
} from 'type-graphql';
import { Context } from '../../context'
import { Resource } from '../../entities';
import { ResourceInput } from '../types';

@Resolver((_of) => Resource)
export class ResourceResolver {
    @Query((_returns) => Resource, { nullable: false })
    async getResource(@Arg('resourceId') resourceId: number, @Ctx() ctx: Context) {
        return await ctx.prisma.resource.findUnique({
            where: { resourceId },
        })
    }

    @Query(() => [Resource])
    async getAllResources(@Ctx() ctx: Context) {
        return await ctx.prisma.resource.findMany();
    }
    // TODO: THIS IS NOT WORKING AS EXPECTED
    @Mutation(() => Resource)
    async createOrUpdateResources(
        @Arg('data')
        data: ResourceInput,
        @Ctx() ctx: Context
    ) {
        return ctx.prisma.resource.upsert({
            where: {
                resourceId: data.resourceId
            },
            update: {
                ResourcesOnRealms: {
                    create: { realmId: data.realmId }
                }
            },
            create: {
                resourceName: data.resourceName,
                resourceId: data.resourceId,
                ResourcesOnRealms: {
                    create: { realmId: data.realmId }
                }
            },
        })
    }
}
