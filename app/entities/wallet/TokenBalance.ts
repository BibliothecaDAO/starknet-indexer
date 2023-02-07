import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "TokenBalance" })
export class TokenBalance {
  @Field()
  address: string;
  @Field(() => Int, { nullable: false })
  tokenId: number;
  @Field()
  amount: string;
}
