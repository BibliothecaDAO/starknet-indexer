import { ObjectType, Field, Int, Float } from "type-graphql";
import { __Type } from "graphql";
import { GraphQLJSON } from "graphql-scalars";

@ObjectType({ description: "Building Cost Model" })
export class BuildingCost {
  @Field(() => Int)
  buildingId: number;

  @Field(() => String)
  buildingName: string;

  @Field(() => Float)
  amount: number;

  @Field(() => GraphQLJSON)
  resources: any;
}
