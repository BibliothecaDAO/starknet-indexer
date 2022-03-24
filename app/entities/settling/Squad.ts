import { ObjectType, Field, Int } from "type-graphql";
import { __Type } from "graphql";
import { SquadAction, SquadType } from "@prisma/client";
import { Realm } from "./Realm";

@ObjectType({ description: "The Squad Model" })
export class Squad {
  @Field(() => Int)
  realmId: number;

  @Field()
  action: SquadAction;

  @Field()
  type: SquadType;

  @Field(() => Realm, { nullable: true })
  realm?: Realm;
}
