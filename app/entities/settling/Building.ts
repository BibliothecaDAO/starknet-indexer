import { ObjectType, Field, ID } from "type-graphql";
import { __Type } from "graphql";
import { BuildingType } from "@prisma/client";
import { Realm } from "./Realm";

@ObjectType({ description: "The Buildings Model" })
export class Building {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  type: BuildingType;

  @Field({ nullable: false })
  realmId: number;

  @Field(() => Realm, { nullable: true })
  realm: Realm;
}
