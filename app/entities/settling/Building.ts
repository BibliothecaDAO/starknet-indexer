import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import * as CONSTANTS from "./../../utils/game_constants";
import { BuildingCost } from "./BuildingCost";

@ObjectType({ description: "The Buildings Model" })
export class Building {
  @Field(() => Int)
  buildingId: number;

  @Field({ nullable: false })
  realmId: number;

  @Field(() => [String])
  builds: string[];

  @Field({ defaultValue: 0 })
  limit: number;

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
    return CONSTANTS.BuildingNameById[String(this.buildingId)] ?? "";
  }

  @Field(() => Int)
  get population(): number {
    if (!this.buildingId) {
      return 0;
    }
    const buildingNameKey = this.buildingName.replace(
      " ",
      ""
    ) as CONSTANTS.BuildingName;

    return CONSTANTS.BuildingPopulation[buildingNameKey] ?? 0;
  }

  get buildingNameKey() {
    return this.buildingName.replace(" ", "") as CONSTANTS.BuildingName;
  }

  @Field(() => Int)
  get culture(): number {
    if (!this.buildingId) {
      return 0;
    }

    return CONSTANTS.BuildingCulture[this.buildingNameKey] ?? 0;
  }

  @Field(() => Int)
  get food(): number {
    if (!this.buildingId) {
      return 0;
    }

    return CONSTANTS.BuildingFood[this.buildingNameKey] ?? 0;
  }

  @Field(() => Int)
  get limitTraitId(): number {
    if (!this.buildingId) {
      return 0;
    }
    return CONSTANTS.BuildingLimitTrait[this.buildingNameKey] ?? 0;
  }

  @Field()
  get limitTraitName(): string {
    if (!this.limitTraitId) {
      return "";
    }
    return CONSTANTS.TraitNameById[String(this.limitTraitId)] ?? "";
  }

  @Field(() => BuildingCost)
  get buildingCost(): BuildingCost {
    return {
      buildingId: this.buildingId,
      buildingName: this.buildingName,
      ...CONSTANTS.BuildingCost[this.buildingNameKey]
    };
  }
}
