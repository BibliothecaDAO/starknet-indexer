import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "Lore Entity Revision" })
export class LorePropsOnEntityRevisions {
  @Field(() => ID)
  entityRevisionId: number;
  @Field(() => ID)
  propId: number;
  @Field(_ => String, { nullable: true })
  value: string | null;
}