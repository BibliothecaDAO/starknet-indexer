import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";
import { ResourceType } from "@prisma/client";
import { Realm } from "./Realm";

@ObjectType({ description: "The Resource Model" })
export class Resource {
  @Field(() => ID)
  id: number;

  @Field({ nullable: false })
  type: ResourceType;

  @Field({ nullable: true })
  realmId: number;

  @Field(() => Realm, { nullable: false })
  realm: Realm;
}
