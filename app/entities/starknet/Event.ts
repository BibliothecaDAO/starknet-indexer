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
  @Field(() => [Number])
  parameters: number[];
  @Field()
  timestamp: Date;
  @Field()
  txHash: string;
}
