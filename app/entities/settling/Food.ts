import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import * as CONSTANTS from "./../../utils/game_constants";

@ObjectType({ description: "The Food Model" })
export class Food {
  @Field(() => Int)
  buildingId: number;

  @Field({ nullable: false })
  realmId: number;

  @Field({ defaultValue: 0 })
  qty: number;

  @Field({ defaultValue: 0 })
  harvests: number;

  @Field()
  createdAt: Date;

  @Field(() => String)
  get buildingName(): string {
    if (!this.buildingId) {
      return "";
    }
    return CONSTANTS.BuildingNameById[String(this.buildingId)] ?? "";
  }
}
