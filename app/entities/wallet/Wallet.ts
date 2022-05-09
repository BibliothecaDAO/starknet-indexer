import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "The Wallet Model" })
export class Wallet {
  @Field()
  address: string;
  @Field(() => Int, { nullable: false })
  realmsL1Held: number;
  @Field(() => Int, { nullable: false })
  realmsL2Held: number;
  @Field(() => Int, { nullable: false })
  realmsSettledHeld: number;
  @Field(() => Int, { nullable: false })
  realmsBridgedHeld: number;
}
