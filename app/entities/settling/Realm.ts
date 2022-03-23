import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";
import { Wallet } from "../wallet/Wallet";
// import { Squad } from "./Squad";
import { Building } from "./Building";
import { Resource } from "./Resource";
import { RealmTrait } from "./RealmTrait";
import { OrderType } from "@prisma/client";

@ObjectType({ description: "The Realm Model" })
export class Realm {
  @Field(() => ID)
  id: number;

  @Field({ nullable: false })
  realmId: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  owner?: string;

  @Field(() => Wallet, { nullable: true })
  wallet: Wallet;

  @Field({ nullable: false })
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
}
