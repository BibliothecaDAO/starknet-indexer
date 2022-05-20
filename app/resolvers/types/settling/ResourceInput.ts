import { InputType, Field, ID, Int } from "type-graphql";
import { __Type } from "graphql";

@InputType()
export class ResourceInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: false })
  realmId: number;

  @Field(() => Int, { nullable: false })
  resourceId: number;
}
