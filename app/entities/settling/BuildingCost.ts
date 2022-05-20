import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "Building Cost Model" })
export class BuildingCost {
  @Field(() => Int, { nullable: false })
  buildingId: number;

  @Field(() => Int, { nullable: false })
  resourceId: number;

  @Field({ nullable: false })
  qty: number;
}
