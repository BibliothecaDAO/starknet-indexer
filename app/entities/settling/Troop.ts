import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { TroopNameById } from "../../utils/game_constants";

@ObjectType({ description: "Troop" })
export class Troop {
  @Field(() => Int, { nullable: false })
  realmId: number;

  @Field(() => Int, { nullable: false })
  troopId: number;

  @Field(() => String)
  get troopName(): string {
    if (!this.troopId) {
      return "";
    }
    return TroopNameById[String(this.troopId)] ?? "";
  }

  @Field(() => Int, { nullable: false })
  index: number;

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

  @Field(() => Int, { nullable: false })
  squadSlot: number;
}
