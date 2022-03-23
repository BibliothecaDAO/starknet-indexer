import { Field, InputType } from "type-graphql";
import { __Type } from "graphql";
import { BuildingType, ResourceType } from "@prisma/client";

@InputType()
export class BuildingCostInput {
  @Field({ nullable: false })
  buildingType: BuildingType;

  @Field({ nullable: false })
  resourceType: ResourceType;

  @Field({ nullable: false })
  qty: number;
}
