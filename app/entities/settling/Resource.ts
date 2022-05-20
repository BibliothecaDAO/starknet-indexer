import { ObjectType, Field, ID, Int } from "type-graphql";
import { __Type } from "graphql";
import { Realm } from "./Realm";

@ObjectType({ description: "The Resource Model" })
export class Resource {
  @Field(() => ID)
  id: number;

  @Field(() => Int, { nullable: false })
  resourceId: number;

  @Field({ nullable: true })
  realmId: number;

  @Field(() => Realm, { nullable: false })
  realm: Realm;

  @Field(() => Int)
  level: number;

  @Field(() => [String])
  upgrades: string[];
}
