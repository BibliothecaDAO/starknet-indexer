import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { Wallet } from "../wallet/Wallet";
import { Building } from "./Building";
import { Resource } from "./Resource";
import { RealmTrait } from "./RealmTrait";
import { OrderType } from "@prisma/client";
import { Squad } from "./Squad";

@ObjectType({ description: "The Realm Model" })
export class Realm {
  @Field(() => Int, { nullable: false })
  realmId: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  owner?: string;

  @Field(() => Wallet, { nullable: true })
  wallet: Wallet;

  @Field(() => Int, { nullable: false })
  rarityRank: number;

  @Field({ nullable: false })
  rarityScore: number;

  @Field({ nullable: true })
  imageUrl: string;

  @Field({ nullable: false })
  orderType: OrderType;

  // @Field(() => Squad, { nullable: true })
  // offenceSquad!: Squad;

  // @Field(() => Squad, { nullable: true })
  // defenceSquad!: Squad;

  @Field(() => [Building], { nullable: true })
  buildings: [Building];

  @Field(() => [Resource], { nullable: true })
  resources: [Resource];

  @Field(() => [RealmTrait], { nullable: true })
  traits: [RealmTrait];

  @Field(() => [Squad], { nullable: true })
  squads: [Squad];
}
