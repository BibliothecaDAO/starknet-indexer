import {
  FindManyBastionLocationResolver,
  BastionLocation,
} from "@generated/type-graphql";
import { Context } from "./../../context";
import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Army } from "../../entities";

@Resolver((_of) => BastionLocation)
export class BastionLocationResolver extends FindManyBastionLocationResolver {
  @FieldResolver(() => [Army])
  async armies(@Ctx() ctx: Context, @Root() location: BastionLocation) {
    return ctx.prisma.army.findMany({
      where: {
        bastionId: location.bastionId,
        bastionCurrentLocation: location.locationId,
      },
    });
  }
}
