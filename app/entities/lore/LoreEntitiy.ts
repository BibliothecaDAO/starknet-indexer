import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";
import { LoreEntityRevision } from "./LoreEntityRevision";

@ObjectType({ description: "Lore Entity" })
export class LoreEntity {
  @Field(() => ID)
  id: number;
  @Field()
  owner: string;
  @Field({ nullable: true })
  ownerDisplayName?: string;
  @Field()
  kind: number;

  @Field((_) => [LoreEntityRevision])
  revisions: LoreEntityRevision[];
}
