import { ObjectType, Field, Int, Float } from "type-graphql";
import { __Type } from "graphql";
import { Wallet } from "./../wallet/Wallet";
import { Building } from "./Building";
import { Resource } from "./Resource";
import { RealmTrait } from "./RealmTrait";
import { Relic } from "./Relic";
import { OrderType } from "@prisma/client";
import { Troop } from "./Troop";

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

  @Field(() => String, { nullable: true })
  ownerL2?: string;

  @Field(() => String, { nullable: true })
  settledOwner?: string;

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

  @Field(() => String, { nullable: true })
  wonder?: String;

  @Field(() => [Building], { nullable: true })
  buildings: [Building];

  @Field(() => [Relic], { nullable: true })
  relic: Relic;

  @Field(() => [Relic], { nullable: true })
  relicsOwned: [Relic];

  @Field(() => [Resource], { nullable: true })
  resources: [Resource];

  @Field(() => [RealmTrait], { nullable: true })
  traits: [RealmTrait];

  @Field(() => [Troop], { nullable: true })
  troops: Troop[];

  @Field(() => [Troop], { nullable: true })
  squad: Troop[];

  @Field(() => [String])
  defendTroopIds: string[];

  @Field({ nullable: true })
  lastAttacked: Date;

  @Field({ nullable: true })
  lastClaimTime: Date;

  @Field({ nullable: true })
  lastVaultTime: Date;

  @Field(() => Float, { nullable: false })
  longitude: number;

  @Field(() => Float, { nullable: false })
  latitude: number;
}
