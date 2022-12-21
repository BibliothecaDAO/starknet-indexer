import { ObjectType, Field, Int, Float } from "type-graphql";
import { __Type } from "graphql";
import { GraphQLJSON } from "graphql-scalars";

@ObjectType({ description: "Resource Labor and Tool Cost Model" })
export class ResourceLaborAndToolCost {
  @Field(() => Int)
  resourceId: number;

  @Field(() => String)
  resourceName: string;

  @Field(() => String)
  tier: string;

  @Field(() => Float)
  amount: number;

  @Field(() => GraphQLJSON)
  costs: any;
}
