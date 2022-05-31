import { ObjectType, Field, ID, Int } from "type-graphql";
import { __Type } from "graphql";
import { Realm } from "./Realm";
import { ResourceNameById } from "./../../utils/game_constants";

@ObjectType({ description: "The Resource Model" })
export class Resource {
  @Field(() => ID)
  id: number;

  @Field(() => Int, { nullable: false })
  resourceId: number;

  // @Field()
  // resourceName: string;

  @Field({ nullable: true })
  realmId: number;

  @Field(() => Realm, { nullable: false })
  realm: Realm;

  @Field(() => Int)
  level: number;

  @Field(() => [String])
  upgrades: string[];

  @Field(() => String)
  get resourceName(): string {
    if (!this.resourceId) {
      return "";
    }
    return ResourceNameById[String(this.resourceId)] ?? "";
  }
}
