import { Field, InputType } from "type-graphql";
import { __Type } from "graphql";
import { RealmTraitType } from "@prisma/client";

@InputType()
export class RealmTraitInput {
  @Field({ nullable: false })
  type: RealmTraitType;

  @Field({ nullable: false })
  qty: number;

  @Field({ nullable: false })
  realmId: number;
}
