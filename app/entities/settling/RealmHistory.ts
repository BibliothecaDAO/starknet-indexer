import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { GraphQLJSON } from "graphql-scalars";
import { Realm } from "./Realm";
import { OrderType } from "@prisma/client";

@ObjectType({ description: "The Realm History Model" })
export class RealmHistory {
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

  @Field(() => String, { nullable: true })
  realmName: string;

  @Field({ nullable: true })
  realmOrder: OrderType;

  @Field(() => GraphQLJSON, { nullable: true })
  data: any;

  @Field({ nullable: true })
  timestamp: Date;

  @Field(() => String, { nullable: true })
  transactionHash: string;

  @Field(() => Realm, { nullable: true })
  realm?: Realm;
}
