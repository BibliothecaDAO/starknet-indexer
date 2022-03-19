import { InputType, Field } from "type-graphql";

@InputType()
export class BuildingsInput {
  @Field()
  realmId: number;

  @Field()
  barracks!: number;
}
