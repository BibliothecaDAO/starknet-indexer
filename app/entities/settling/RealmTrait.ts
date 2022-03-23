import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";
import { RealmTraitType } from "@prisma/client";
import { Realm } from "./Realm";

@ObjectType({ description: "Realm Trait Model" })
export class RealmTrait {
  @Field(() => ID)
  id: number;

  @Field({ nullable: false })
  type: RealmTraitType;

  @Field({ nullable: false })
  qty: number;

  @Field({ nullable: false })
  realmId: number;

  @Field(() => Realm, { nullable: true })
  realm: Realm;
}
