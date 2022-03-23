import { ObjectType, Field } from "type-graphql";
import { __Type } from "graphql";
import { BuildingType, ResourceType } from "@prisma/client";

@ObjectType({ description: "Building Cost Model" })
export class BuildingCost {
  @Field({ nullable: false })
  buildingType: BuildingType;

  @Field({ nullable: false })
  resourceType: ResourceType;

  @Field({ nullable: false })
  qty: number;
}
