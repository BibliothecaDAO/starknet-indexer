// import { Prisma } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { InputType, Field } from "type-graphql";
import { IntFilterInput, StringFilterInput } from "../common";
import { BuildingTypeInput } from "./BuildingInput";
import { OrderTypeInput } from "./OrderInput";
import { RealmTraitTypeInput } from "./RealmTraitInput";
import { ResourceTypeInput } from "./ResourceInput";
import { SquadActionInput, SquadTypeInput } from "./SquadInput";

@InputType()
export class RealmFilterInput implements Partial<Prisma.RealmWhereInput> {
  @Field(() => IntFilterInput, { nullable: true })
  realmId?: object;
  @Field(() => StringFilterInput, { nullable: true })
  name?: object;
  @Field(() => StringFilterInput, { nullable: true })
  owner?: object;
  @Field(() => IntFilterInput, { nullable: true })
  rarityRank?: object;
  @Field(() => IntFilterInput, { nullable: true })
  rarityScore?: object;
  @Field(() => BuildingTypeInput, { nullable: true })
  buildingType?: object;
  @Field(() => ResourceTypeInput, { nullable: true })
  resourceType?: object;
  @Field(() => SquadTypeInput, { nullable: true })
  squadType?: object;
  @Field(() => OrderTypeInput, { nullable: true })
  orderType?: object;
  @Field(() => RealmTraitTypeInput, { nullable: true })
  traitType?: object;
  @Field(() => SquadActionInput, { nullable: true })
  squadAction?: object;
  @Field(() => [RealmFilterInput], { nullable: true })
  AND?: [RealmFilterInput];
  @Field(() => [RealmFilterInput], { nullable: true })
  OR?: [RealmFilterInput];
  @Field(() => [RealmFilterInput], { nullable: true })
  NOT?: [RealmFilterInput];
}
