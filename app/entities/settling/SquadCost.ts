import { ObjectType, Field } from "type-graphql";
import { __Type } from "graphql";
import { SquadType, ResourceType } from "@prisma/client";

@ObjectType({ description: "Squad Cost Model" })
export class SquadCost {
  @Field({ nullable: false })
  squadType: SquadType;

  @Field({ nullable: false })
  resourceType: ResourceType;

  @Field({ nullable: false })
  qty: number;
}
