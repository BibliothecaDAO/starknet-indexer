import { InputType, Field, ID } from "type-graphql";
import { __Type } from "graphql";
import { ResourceType } from "@prisma/client";

@InputType()
export class ResourceInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: false })
  realmId: number;

  @Field({ nullable: false })
  type: ResourceType;
}
