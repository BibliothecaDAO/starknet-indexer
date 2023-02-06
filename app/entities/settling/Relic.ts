import { ObjectType, Field } from "type-graphql";
import { __Type } from "graphql";

import { Realm } from "./Realm";

@ObjectType({ description: "The Relic Model" })
export class Relic {
  // @Field()
  // resourceName: string;

  @Field({ nullable: true })
  realmId: number;

  @Field(() => Realm, { nullable: false })
  originRealm: Realm;

  @Field({ nullable: true })
  heldByRealm: number;

  @Field(() => Realm, { nullable: false })
  realmHolder: Realm;

  @Field({ nullable: false })
  isAnnexed: boolean;
}
