import { ObjectType, Field, Int, Float } from "type-graphql";
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

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  owner?: string;

  @Field(() => String, { nullable: true })
  bridgedOwner?: string;

  @Field(() => Wallet, { nullable: true })
  wallet: Wallet;

  @Field(() => Int, { nullable: false })
  rarityRank: number;

  @Field(() => Float, { nullable: false })
  rarityScore: number;

  @Field(() => String, { nullable: true })
  imageUrl: string;

  @Field({ nullable: false })
  orderType: OrderType;

  @Field(() => String, { nullable: false })
  wonder: String;

  @Field(() => [Building], { nullable: true })
  buildings: [Building];

  @Field(() => [Resource], { nullable: true })
  resources: [Resource];

  @Field(() => [RealmTrait], { nullable: true })
  traits: [RealmTrait];

  @Field(() => [Squad], { nullable: true })
  squads: [Squad];
}
