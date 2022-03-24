import { InputType, Field, ID, registerEnumType } from "type-graphql";
import { __Type } from "graphql";
import { ResourceType } from "@prisma/client";

registerEnumType(ResourceType, {
  name: "ResourceType",
  description: "ResourceType"
});

@InputType()
export class ResourceTypeInput {
  @Field(() => ResourceType, { nullable: true })
  equals?: ResourceType;
  @Field(() => [ResourceType], { nullable: true })
  in?: [ResourceType];
  @Field(() => [ResourceType], { nullable: true })
  notIn?: [ResourceType];
  @Field(() => [ResourceType], { nullable: true })
  not?: ResourceType;
}

@InputType()
export class ResourceInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: false })
  realmId: number;

  @Field(() => ResourceType, { nullable: false })
  type: ResourceType;
}
