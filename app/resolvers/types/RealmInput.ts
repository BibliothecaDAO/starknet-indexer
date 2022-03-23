import { OrderType } from "@prisma/client";
import { InputType, Field } from "type-graphql";

@InputType()
export class RealmInput {
  @Field()
  name: string;

  @Field()
  realmId: number;

  @Field({ nullable: true })
  owner?: string;

  @Field({ nullable: true })
  rarityRank?: number;

  @Field({ nullable: true })
  rarityScore?: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  orderType?: OrderType;
}
