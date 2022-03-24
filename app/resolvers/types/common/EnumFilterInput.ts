import { InputType, Field } from "type-graphql";

@InputType()
export class EnumFilterInput {
  @Field({ nullable: true })
  equals?: string;
  @Field(() => [String], { nullable: true })
  in?: [string];
  @Field(() => [String], { nullable: true })
  notIn?: [string];
  @Field(() => [String], { nullable: true })
  not?: string;
}
