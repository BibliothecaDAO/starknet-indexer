import { InputType, Field, ID, Int } from "type-graphql";

@InputType()
export class BuildingInput {
  @Field(() => ID, { nullable: true })
  id: number;

  @Field(() => Int, { nullable: false })
  buildingId: number;

  @Field({ nullable: false })
  realmId: number;
}
