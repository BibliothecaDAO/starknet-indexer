import { ObjectType, Field, Int, Float } from "type-graphql";
import { __Type } from "graphql";
import { GraphQLJSON } from "graphql-scalars";

@ObjectType({ description: "Battalion Cost Model" })
export class BattalionCost {
  @Field(() => Int, { nullable: false })
  battalionId: number;

  @Field(() => String)
  battalionName: string;

  @Field(() => Float)
  amount: number;

  @Field(() => GraphQLJSON)
  resources: any;
}
