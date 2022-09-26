import { ObjectType, Field, ID, Int } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "StarkNet Event Model" })
export class Event {
  @Field(() => ID)
  id: number;
  @Field()
  eventId: string;
  @Field(() => Int)
  blockNumber: number;
  @Field(() => Int)
  transactionNumber: number;
  @Field()
  chainId: string;
  @Field()
  contract: string;
  @Field()
  name: string;
  @Field(() => [String])
  parameters: string[];
  @Field(() => [String])
  keys: string[];
  @Field()
  timestamp: Date;
  @Field()
  txHash: string;
}
