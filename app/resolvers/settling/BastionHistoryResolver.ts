import { Resolver, Arg, Query, Ctx } from "type-graphql";
import { Context } from "../../context";
import { BastionHistory } from "../../entities";
import {
  BastionHistoryWhereInput,
} from "@generated/type-graphql";

@Resolver((_of) => BastionHistory)
export class BastionHistoryResolver {
  @Query(() => [BastionHistory])
  async getBastionHistory(
    @Ctx() ctx: Context,
    @Arg("filter", { nullable: true }) filter: BastionHistoryWhereInput,
    @Arg("take", { nullable: true, defaultValue: 20 }) take: number,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number
  ) {
    return await ctx.prisma.bastionHistory.findMany({
      where: filter,
      take,
      skip,
      include: {realmHistory: true},
      orderBy: { realmHistory: {eventId: "desc"} }
    });
  }
}
