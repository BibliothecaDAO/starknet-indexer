import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { Realm } from "./Realm";

@ObjectType({ description: "Army" })
export class Army {
  @Field(() => Int, { nullable: false })
  realmId: number;
  @Field(() => Int, { nullable: false })
  armyId: number;
  @Field(() => Int, { nullable: false })
  destinationRealmId: number;
  @Field(() => Realm, { nullable: true })
  destinationRealm: Realm;
  @Field({ nullable: true })
  destinationArrivalTime: Date;

  // ArmyData
  @Field(() => Int, { nullable: false })
  armyPacked: number;
  @Field({ nullable: true })
  lastAttacked: Date;
  @Field(() => Int, { nullable: false })
  xp: number;
  @Field(() => Int, { nullable: false })
  level: number;
  @Field(() => Int, { nullable: false })
  callSign: number;

  // Battalions
  @Field(() => Int, { nullable: false })
  lightCavalryQty: number;
  @Field(() => Int, { nullable: false })
  lightCavalryHealth: number;
  @Field(() => Int, { nullable: false })
  heavyCavalryQty: number;
  @Field(() => Int, { nullable: false })
  heavyCavalryHealth: number;
  @Field(() => Int, { nullable: false })
  archerQty: number;
  @Field(() => Int, { nullable: false })
  archerHealth: number;
  @Field(() => Int, { nullable: false })
  longbowQty: number;
  @Field(() => Int, { nullable: false })
  longbowHealth: number;
  @Field(() => Int, { nullable: false })
  mageQty: number;
  @Field(() => Int, { nullable: false })
  mageHealth: number;
  @Field(() => Int, { nullable: false })
  arcanistQty: number;
  @Field(() => Int, { nullable: false })
  arcanistHealth: number;
  @Field(() => Int, { nullable: false })
  lightInfantryQty: number;
  @Field(() => Int, { nullable: false })
  lightInfantryHealth: number;
  @Field(() => Int, { nullable: false })
  heavyInfantryQty: number;
  @Field(() => Int, { nullable: false })
  heavyInfantryHealth: number;
}
