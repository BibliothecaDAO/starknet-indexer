import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { GraphQLJSON } from "graphql-scalars";

@ObjectType({ description: "The Realm Event Model" })
export class RealmEvent {
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => Int, { nullable: false })
  realmId: number;

  @Field(() => String, { nullable: true })
  eventId: string;

  @Field(() => String, { nullable: true })
  eventType: string;

  @Field(() => String, { nullable: true })
  realmOwner: string;

  @Field(() => GraphQLJSON, { nullable: true })
  data: any;

  @Field(() => String, { nullable: true })
  timestamp: string;

  @Field(() => String, { nullable: true })
  transactionHash: string;
}
