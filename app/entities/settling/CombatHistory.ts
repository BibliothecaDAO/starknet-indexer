import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { GraphQLJSON } from "graphql-scalars";

@ObjectType({ description: "The Combat History Model" })
export class CombatHistory {
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => String)
  eventId: string;

  @Field(() => String)
  eventType: string;

  @Field(() => Int)
  attackRealmId: number;

  @Field(() => String, { nullable: true })
  attackRealmOwner: string;

  @Field(() => GraphQLJSON, { nullable: true })
  attackSquad: any;

  @Field(() => Int)
  defendRealmId: number;

  @Field(() => String, { nullable: true })
  defendRealmOwner: string;

  @Field(() => GraphQLJSON, { nullable: true })
  defendSquad: any;

  @Field({ nullable: true })
  timestamp: Date;

  @Field(() => String, { nullable: true })
  transactionHash: string;

  @Field(() => Int, { defaultValue: 0 })
  outcome: number;

  @Field(() => Int, { defaultValue: 0 })
  attackType: number;

  @Field(() => Int, { defaultValue: 0 })
  hitPoints: number;
}
