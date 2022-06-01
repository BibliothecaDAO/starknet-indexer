import { ObjectType, Field, ID, Int } from "type-graphql";
import { __Type } from "graphql";
import { Realm } from "./Realm";
import {
  BuildingCulture,
  BuildingFood,
  BuildingLimitTrait,
  BuildingName,
  BuildingNameById,
  BuildingPopulation,
  TraitNameById
} from "./../../utils/game_constants";

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

  @Field(() => [String])
  builds: string[];

  @Field(() => Int)
  get count(): number {
    if (!this.buildingId) {
      return 0;
    }
    return this.builds?.length ?? 0;
  }

  @Field(() => String)
  get buildingName(): string {
    if (!this.buildingId) {
      return "";
    }
    return BuildingNameById[String(this.buildingId)] ?? "";
  }

  @Field(() => Int)
  get population(): number {
    if (!this.buildingId) {
      return 0;
    }
    return BuildingPopulation[this.buildingName as BuildingName] ?? 0;
  }

  @Field(() => Int)
  get culture(): number {
    if (!this.buildingId) {
      return 0;
    }
    return BuildingCulture[this.buildingName as BuildingName] ?? 0;
  }

  @Field(() => Int)
  get food(): number {
    if (!this.buildingId) {
      return 0;
    }
    return BuildingFood[this.buildingName as BuildingName] ?? 0;
  }

  @Field(() => Int)
  get limitTraitId(): number {
    if (!this.buildingId) {
      return 0;
    }
    return BuildingLimitTrait[this.buildingName as BuildingName] ?? 0;
  }

  @Field()
  get limitTraitName(): string {
    if (!this.limitTraitId) {
      return "";
    }
    return TraitNameById[String(this.limitTraitId)] ?? "";
  }
}
