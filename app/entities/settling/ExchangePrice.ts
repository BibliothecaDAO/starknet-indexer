import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "Exchange Price" })
export class ExchangePrice {
  @Field(() => String)
  date: string;

  @Field(() => Int)
  hour: number;

  @Field(() => Int)
  tokenId: number;

  @Field(() => String)
  rateAmount: string;

  @Field(() => String)
  buyAmount: string;

  @Field(() => String)
  sellAmount: string;
}
