import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";
import { LorePoisOnEntityRevisions } from "./LorePoisOnEntityRevisions";
import { LorePropsOnEntityRevisions } from "./LorePropsOnEntityRevisions";

@ObjectType({ description: "Lore Entity Revision" })
export class LoreEntityRevision {
  @Field(() => ID)
  id: number;
  @Field()
  revisionNumber: number;
  @Field({ nullable: true })
  title?: string;
  @Field({ nullable: true })
  markdown?: string;
  @Field({ nullable: true })
  excerpt?: string;
  @Field()
  createdAt: Date;

  @Field(_ => [LorePoisOnEntityRevisions])
  pois: LorePoisOnEntityRevisions[];

  @Field(_ => [LorePropsOnEntityRevisions])
  props: LorePropsOnEntityRevisions[];
}