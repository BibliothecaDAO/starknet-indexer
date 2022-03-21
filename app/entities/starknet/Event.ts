import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@ObjectType({ description: "StarkNet Event Model" })
export class Event {
  @Field(() => ID)
  id: number;
  @Field()
  eventId: number;
  @Field()
  blockNumber: number;
  @Field()
  chainId: string;
  @Field()
  contract: string;
  @Field()
  name: string;
  @Field(() => GraphQLJSONObject)
  parameters: object;
  @Field()
  timestamp: Date;
  @Field()
  txHash: string;
}
