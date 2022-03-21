import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "../../context";

import { Event } from "../../entities/starknet/Event";
// import { EventInput } from "../types/event-input";

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

  // @Mutation(() => Event)
  // async createOrUpdateEvent(
  //   @Arg("data")
  //   data: EventInput,
  //   @Ctx() ctx: Context
  // ) {
  //   const { eventId, ...updates } = data;
  //   return ctx.prisma.event.upsert({
  //     where: { eventId },
  //     update: { ...updates },
  //     create: { eventId, ...updates }
  //   });
  // }
}
