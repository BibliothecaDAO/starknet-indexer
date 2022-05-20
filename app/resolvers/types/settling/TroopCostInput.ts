import { Field, InputType, Int } from "type-graphql";
import { __Type } from "graphql";

@InputType()
export class TroopCostInput {
  @Field(() => Int, { nullable: false })
  troopId: number;

  @Field(() => Int, { nullable: false })
  resourceId: number;

  @Field({ nullable: false })
  qty: number;
}
