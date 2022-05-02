import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "Lore Entity Revision" })
export class LorePoisOnEntityRevisions {
  @Field(() => ID)
  entityRevisionId: number;
  @Field(() => ID)
  poiId: number;
  @Field(_ => String, { nullable: true })
  assetId: string | null;
}