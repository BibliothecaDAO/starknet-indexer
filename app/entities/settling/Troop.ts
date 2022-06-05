import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { TroopStats } from "./TroopStats";

@ObjectType({ description: "Troop" })
export class Troop extends TroopStats {
  @Field(() => Int, { nullable: false })
  realmId: number;

  @Field(() => Int, { nullable: false })
  index: number;

  @Field(() => Int, { nullable: false })
  squadSlot: number;
}
