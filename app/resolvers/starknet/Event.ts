import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "../../context";

import { Event } from "../../entities/starknet/Event";

@Resolver((_of) => Event)
export class EventResolver {
  @Query((_returns) => Event, { nullable: false })
  async getEvent(@Arg("id") id: number, @Ctx() ctx: Context) {
    return await ctx.prisma.desiege.findUnique({
      where: { id }
    });
  }

  @Query(() => [Event])
  async getEvents(@Ctx() ctx: Context) {
    return await ctx.prisma.event.findMany({
      orderBy: {
        eventId: "desc"
      }
    });
  }
}
