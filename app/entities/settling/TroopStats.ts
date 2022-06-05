import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import * as CONSTANTS from "./../../utils/game_constants";
import { TroopCost } from "./TroopCost";

@ObjectType({ description: "TroopStats" })
export class TroopStats {
  @Field(() => Int, { nullable: false })
  troopId: number;

  @Field(() => String)
  get troopName(): string {
    if (!this.troopId) {
      return "";
    }
    return CONSTANTS.TroopNameById[String(this.troopId)] ?? "";
  }

  @Field(() => TroopCost, { nullable: true })
  get troopCost(): TroopCost | null {
    if (!this.troopId) {
      return null;
    }
    return {
      troopId: this.troopId,
      troopName: this.troopName,
      ...CONSTANTS.TroopCost[this.troopNameKey]
    };
  }

  get troopNameKey() {
    return this.troopName.replace(" ", "") as CONSTANTS.TroopName;
  }

  @Field(() => Int, { nullable: false })
  type: number;

  @Field(() => Int, { nullable: false })
  tier: number;

  @Field(() => Int, { nullable: false })
  agility: number;

  @Field(() => Int, { nullable: false })
  attack: number;

  @Field(() => Int, { nullable: false })
  defense: number;

  @Field(() => Int, { nullable: false })
  vitality: number;

  @Field(() => Int, { nullable: false })
  wisdom: number;
}
