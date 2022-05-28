import { ObjectType, Field, ID, Int } from "type-graphql";
import { __Type } from "graphql";
import { Realm } from "./Realm";
import { BuildingNameById } from "../../utils/game_constants";

@ObjectType({ description: "The Buildings Model" })
export class Building {
  @Field(() => ID)
  id: number;

  @Field(() => Int, { nullable: true })
  buildingId: number;

  @Field({ nullable: false })
  realmId: number;

  @Field(() => Realm, { nullable: true })
  realm?: Realm;

  @Field(() => String)
  get buildingName(): string {
    if (!this.buildingId) {
      return "";
    }
    return BuildingNameById[String(this.buildingId)] ?? "";
  }
}
