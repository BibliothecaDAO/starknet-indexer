import { InputType, Field } from "type-graphql";
import { Event } from "../../entities/starknet/Event";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType()
export class EventInput implements Partial<Event> {
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
