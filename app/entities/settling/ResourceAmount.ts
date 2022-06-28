import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { ResourceNameById } from "../../utils/game_constants";

@ObjectType({ description: "The Token Amount Model" })
export class ResourceAmount {
  @Field(() => Int)
  resourceId: number;

  @Field()
  amount: string;

  @Field(() => String)
  get resourceName(): string {
    if (!this.resourceId) {
      return "";
    }
    return ResourceNameById[String(this.resourceId)] ?? "";
  }
}
