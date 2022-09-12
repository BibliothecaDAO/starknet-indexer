import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "./../../context";
import { Resource } from "./../../entities";
import { ResourceInput } from "./../types";

@Resolver((_of) => Resource)
export class ResourceResolver {
  @Query((_returns) => Resource, { nullable: false })
  async getResource(@Arg("id") id: number, @Ctx() ctx: Context) {
    return await ctx.prisma.resource.findUnique({
      where: { id }
    });
  }

  @Query(() => [Resource])
  async getResources(@Ctx() ctx: Context) {
    return await ctx.prisma.resource.findMany({});
  }

  @Query(() => [Resource])
  async getResourcesByAddress(
    @Ctx() ctx: Context,
    @Arg("address") address: string
  ) {
    return await ctx.prisma.resource.findMany({
      where: {
        realm: { owner: address }
      }
    });
  }

  // @Mutation(() => Resource)
  async createOrUpdateResources(
    @Arg("data")
    data: ResourceInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.resource.upsert({
      where: {
        resourceId_realmId: {
          realmId: data.realmId,
          resourceId: data.resourceId
        }
      },
      update: {
        resourceId: data.resourceId,
        realmId: data.realmId
      },
      create: {
        resourceId: data.resourceId,
        realmId: data.realmId
      }
    });
  }
}
