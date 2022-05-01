import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "Lore POI" })
// It doesn't love POI => so use Poi
export class LorePoi {
  @Field(() => ID)
  id: number;
  @Field()
  name: string;
  @Field(_ => String, { nullable: true })
  assetType?: string;
}