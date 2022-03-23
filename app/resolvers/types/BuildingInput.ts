import { InputType, Field, ID } from "type-graphql";
import { BuildingType } from "@prisma/client";

@InputType()
export class BuildingInput {
  @Field(() => ID, { nullable: true })
  id: number;

  @Field({ nullable: false })
  type: BuildingType;

  @Field({ nullable: false })
  realmId: number;
}
