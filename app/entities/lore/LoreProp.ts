import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";

@ObjectType({ description: "Lore POI" })
// It doesn't love POI => so use Poi
export class LoreProp {
  @Field(() => ID)
  id: number;
  @Field()
  name: string;
}