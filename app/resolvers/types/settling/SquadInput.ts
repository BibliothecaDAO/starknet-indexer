import { Field, Int, InputType } from "type-graphql";
import { __Type } from "graphql";
import { SquadAction, SquadType } from "@prisma/client";

@InputType()
export class SquadInput {
  @Field(() => Int)
  realmId: number;

  @Field()
  action: SquadAction;

  @Field()
  type: SquadType;
}
