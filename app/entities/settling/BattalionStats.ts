import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "BattalionStats" })
export class BattalionStats {
  @Field(() => Int, { nullable: false })
  battalionId: number;
  @Field()
  battalionName: string;
  @Field()
  combatType: string;
  @Field()
  type: string;
  @Field(() => Int, { nullable: false })
  requiredBuildingId: number;
  @Field()
  requiredBuildingName: string;
  @Field(() => Int, { nullable: false })
  value: number;
}
