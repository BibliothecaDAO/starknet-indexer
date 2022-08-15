import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { CombatHistory } from "./CombatHistory";
import { ResourceAmount } from "./ResourceAmount";

@ObjectType({ description: "The CombatResult Model" })
export class CombatResult {
  @Field(() => Int)
  defendRealmId: number;

  @Field(() => Int)
  attackRealmId: number;

  @Field()
  transactionHash: string;

  @Field(() => [CombatHistory], { defaultValue: [] })
  history: CombatHistory[];

  @Field(() => [ResourceAmount], { defaultValue: [] })
  resourcesPillaged: ResourceAmount[];

  @Field(() => Int, { defaultValue: 0 })
  relicLost: number;

  @Field(() => Int, { defaultValue: 0 })
  outcome: number;

  @Field({ nullable: true })
  timestamp: Date;
}
