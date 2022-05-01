import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "Last Indexed Events" })
export class LastIndexedEvent {
  @Field(() => ID)
  id: number;
  @Field()
  moduleName: string;
  @Field()
  eventId: string;
}
