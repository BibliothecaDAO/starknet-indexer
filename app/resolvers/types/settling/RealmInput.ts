import { OrderType } from "@prisma/client";
import { InputType, Field, Int } from "type-graphql";

@InputType()
export class RealmInput {
  @Field()
  name: string;

  @Field(() => Int, { nullable: false })
  realmId: number;

  @Field({ nullable: true })
  owner?: string;

  @Field({ nullable: true })
  bridgedOwner?: string;

  @Field({ nullable: true })
  wonder?: string;

  @Field(() => Int, { nullable: true })
  rarityRank?: number;

  @Field({ nullable: true })
  rarityScore?: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  orderType?: OrderType;
}
