import {
  FindManyBastionResolver,
  Bastion,
  BastionLocation,
} from "@generated/type-graphql";
import { Context } from "./../../context";
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";

@Resolver((_of) => Bastion)
export class BastionResolver extends FindManyBastionResolver {
  @Query((_returns) => [Bastion], { nullable: false })
  async bastions(@Ctx() ctx: Context) {
    return ctx.prisma.bastion.findMany();
  }

  @Query((_returns) => Bastion, { nullable: false })
  async bastion(@Ctx() ctx: Context, @Arg("id") bastionId: number) {
    return ctx.prisma.bastion.findUnique({ where: { bastionId } });
  }

  @FieldResolver(() => [BastionLocation])
  async locations(@Ctx() ctx: Context, @Root() bastion: Bastion) {
    return ctx.prisma.bastionLocation.findMany({
      where: { bastionId: bastion.bastionId },
      orderBy: { locationId: "asc" },
    });
  }
}
