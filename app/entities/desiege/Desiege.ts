import { ObjectType, Field, ID, Int } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "The Desiege Model" })
export class Desiege {
  @Field(() => ID)
  id: number;
  @Field(() => Int)
  gameId: Number;
  @Field(() => Int)
  winner: number;
  @Field(() => Int)
  attackedTokens: number;
  @Field(() => Int)
  defendedTokens: number;
  @Field()
  eventIndexed: number;
  @Field(() => Int)
  initialHealth: number;
  @Field(() => Int)
  startBlock: number;
  @Field(() => Int)
  endBlock: number;
  @Field()
  startedOn?: Date;
}
