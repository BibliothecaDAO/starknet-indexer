import { InputType, Field, ID, registerEnumType } from "type-graphql";
import { BuildingType } from "@prisma/client";

@InputType()
export class BuildingTypeInput {
  @Field(() => BuildingType, { nullable: true })
  equals?: BuildingType;
  @Field(() => [BuildingType], { nullable: true })
  in?: [BuildingType];
  @Field(() => [BuildingType], { nullable: true })
  notIn?: [BuildingType];
  @Field(() => [BuildingType], { nullable: true })
  not?: BuildingType;
}

registerEnumType(BuildingType, {
  name: "BuildingType"
});

@InputType()
export class BuildingInput {
  @Field(() => ID, { nullable: true })
  id: number;

  @Field(() => BuildingType, { nullable: false })
  type: BuildingType;

  @Field({ nullable: false })
  realmId: number;
}
