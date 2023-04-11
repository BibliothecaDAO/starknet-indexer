import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { RealmHistory } from "./RealmHistory";

@ObjectType({ description: "The Bastion History Model" })
export class BastionHistory {

  @Field(() => Int, { nullable: false })
  bastionId: number;

  @Field(() => String, { nullable: false })
  realmHistoryEventId: string;

  @Field(() => String, { nullable: false })
  realmHistoryEventType: string;

  @Field(() => RealmHistory, {nullable: false})
  realmHistory: RealmHistory;
}
