import { Field, Int, InputType, registerEnumType } from "type-graphql";
import { __Type } from "graphql";
import { SquadAction, SquadType } from "@prisma/client";

registerEnumType(SquadType, {
  name: "SquadType"
});

@InputType()
export class SquadTypeInput {
  @Field(() => SquadType, { nullable: true })
  equals?: SquadType;
  @Field(() => [SquadType], { nullable: true })
  in?: [SquadType];
  @Field(() => [SquadType], { nullable: true })
  notIn?: [SquadType];
  @Field(() => [SquadType], { nullable: true })
  not?: SquadType;
}

registerEnumType(SquadAction, {
  name: "SquadAction"
});

@InputType()
export class SquadActionInput {
  @Field(() => SquadAction, { nullable: true })
  equals?: SquadAction;
  @Field(() => [SquadAction], { nullable: true })
  in?: [SquadAction];
  @Field(() => [SquadAction], { nullable: true })
  notIn?: [SquadAction];
  @Field(() => [SquadAction], { nullable: true })
  not?: SquadAction;
}

@InputType()
export class SquadInput {
  @Field(() => Int)
  realmId: number;

  @Field(() => SquadAction)
  action: SquadAction;

  @Field(() => SquadType)
  type: SquadType;
}
