import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "Troop Cost Model" })
export class TroopCost {
  @Field(() => Int, { nullable: false })
  troopId: number;

  @Field(() => Int, { nullable: false })
  resourceId: number;

  @Field({ nullable: false })
  qty: number;
}
