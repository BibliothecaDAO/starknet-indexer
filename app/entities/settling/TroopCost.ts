import { ObjectType, Field, Int, Float } from "type-graphql";
import { __Type } from "graphql";
import { GraphQLJSON } from "graphql-scalars";

@ObjectType({ description: "Troop Cost Model" })
export class TroopCost {
  @Field(() => Int, { nullable: false })
  troopId: number;

  @Field(() => String)
  troopName: string;

  @Field(() => Float)
  amount: number;

  @Field(() => GraphQLJSON)
  resources: any;
}
