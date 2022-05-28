import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { ResourceNameById } from "../../utils/game_constants";

@ObjectType({ description: "Exchange Rate" })
export class ExchangeRate {
  @Field(() => String)
  date: string;

  @Field(() => Int)
  hour: number;

  @Field(() => Int, { nullable: false })
  tokenId: number;

  @Field(() => String)
  amount: string;

  @Field(() => String)
  buyAmount: string;

  @Field(() => String)
  sellAmount: string;

  @Field(() => String)
  get tokenName(): string {
    if (!this.tokenId) {
      return "";
    }
    return ResourceNameById[String(this.tokenId)] ?? "";
  }
}
