import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "StarkNet Event Model" })
export class Event {
  @Field(() => ID)
  id: number;
  @Field()
  eventId: number;
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
