import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import {
  BattalionNameById,
  BuildingNameById,
  ResourceNameById,
} from "../../utils/game_constants";

@ObjectType({ description: "The Token Amount Model" })
export class ResourceAmount {
  constructor(resourceId: number, amount: string) {
    this.resourceId = resourceId;
    this.amount = amount;
  }

  @Field(() => Int)
  resourceId: number;

  @Field()
  amount: string;

  @Field(() => String)
  get resourceName(): string {
    if (!this.resourceId) {
      return "";
    }
    return ResourceNameById[String(this.resourceId)] ?? "";
  }
}

@ObjectType({ description: "The Token Amount Model" })
export class ResourceAmountByBuilding extends ResourceAmount {
  constructor(buildingId: number, resourceId: number, amount: string) {
    super(resourceId, amount);
    this.buildingId = buildingId;
  }

  @Field(() => Int)
  buildingId: number;

  @Field(() => String)
  get buildingName(): string {
    if (!this.buildingId) {
      return "";
    }
    return BuildingNameById[String(this.buildingId)] ?? "";
  }
}

@ObjectType({ description: "The Token Amount Model" })
export class ResourceAmountByBattalion extends ResourceAmount {
  constructor(battalionId: number, resourceId: number, amount: string) {
    super(resourceId, amount);
    this.battalionId = battalionId;
  }

  @Field(() => Int)
  battalionId: number;

  @Field(() => String)
  get battalionName(): string {
    if (!this.battalionId) {
      return "";
    }
    return BattalionNameById[String(this.battalionId)] ?? "";
  }
}
