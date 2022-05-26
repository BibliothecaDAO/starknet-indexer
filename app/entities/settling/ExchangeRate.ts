import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "Exchange Rate" })
export class ExchangeRate {
  @Field(() => String)
  date: string;

  @Field(() => Int)
  hour: number;

  @Field(() => Int)
  tokenId: number;

  @Field(() => String)
  amount: string;

  @Field(() => String)
  buyAmount: string;

  @Field(() => String)
  sellAmount: string;
}
