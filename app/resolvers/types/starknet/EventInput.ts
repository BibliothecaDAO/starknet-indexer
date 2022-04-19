import { InputType, Field } from "type-graphql";
import { Event } from "../../../entities/starknet/Event";

@InputType()
export class EventInput implements Partial<Event> {
  @Field()
  eventId: string;
  @Field()
  blockNumber: number;
  @Field()
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
