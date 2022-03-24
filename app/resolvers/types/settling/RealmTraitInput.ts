import { Field, InputType, registerEnumType } from "type-graphql";
import { __Type } from "graphql";
import { RealmTraitType } from "@prisma/client";

registerEnumType(RealmTraitType, {
  name: "RealmTraitType"
});

@InputType()
export class RealmTraitTypeInput {
  @Field(() => RealmTraitType, { nullable: true })
  equals?: RealmTraitType;
  @Field(() => [RealmTraitType], { nullable: true })
  in?: [RealmTraitType];
  @Field(() => [RealmTraitType], { nullable: true })
  notIn?: [RealmTraitType];
  @Field(() => [RealmTraitType], { nullable: true })
  not?: RealmTraitType;
}

@InputType()
export class RealmTraitInput {
  @Field(() => RealmTraitType, { nullable: false })
  type: RealmTraitType;

  @Field({ nullable: false })
  qty: number;

  @Field({ nullable: false })
  realmId: number;
}
