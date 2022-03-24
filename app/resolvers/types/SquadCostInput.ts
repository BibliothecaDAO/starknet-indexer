import { Field, InputType } from "type-graphql";
import { __Type } from "graphql";
import { ResourceType, SquadType } from "@prisma/client";

@InputType()
export class SquadCostInput {
  @Field({ nullable: false })
  squadType: SquadType;

  @Field({ nullable: false })
  resourceType: ResourceType;

  @Field({ nullable: false })
  qty: number;
}
