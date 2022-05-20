// import { Prisma } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { InputType, Field, Int } from "type-graphql";
import { IntFilterInput, StringFilterInput } from "../common";
import { OrderTypeInput } from "./OrderInput";
// import { RealmTraitFilterInput } from "./RealmTraitInput";

@InputType()
export class RealmFilterInput implements Partial<Prisma.RealmWhereInput> {
  @Field(() => IntFilterInput, { nullable: true })
  realmId?: object;
  @Field(() => StringFilterInput, { nullable: true })
  name?: object;
  @Field(() => StringFilterInput, { nullable: true })
  owner?: object;
  @Field(() => StringFilterInput, { nullable: true })
  bridgedOwner?: object;
  @Field(() => StringFilterInput, { nullable: true })
  ownerL2?: object;
  @Field(() => StringFilterInput, { nullable: true })
  settledOwner?: object;
  @Field(() => IntFilterInput, { nullable: true })
  rarityRank?: object;
  @Field(() => IntFilterInput, { nullable: true })
  rarityScore?: object;
  @Field(() => Int, { nullable: true })
  buildingId?: number;
  @Field(() => Int, { nullable: true })
  resourceId?: number;
  @Field(() => Int, { nullable: true })
  troopId?: number;
  @Field(() => OrderTypeInput, { nullable: true })
  orderType?: object;
  // @Field(() => RealmTraitFilterInput, { nullable: true })
  // trait?: object;
  @Field(() => StringFilterInput, { nullable: true })
  wonder?: object;
  @Field(() => [RealmFilterInput], { nullable: true })
  AND?: [RealmFilterInput];
  @Field(() => [RealmFilterInput], { nullable: true })
  OR?: [RealmFilterInput];
  @Field(() => [RealmFilterInput], { nullable: true })
  NOT?: [RealmFilterInput];
}
