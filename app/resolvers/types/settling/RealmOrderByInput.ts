import { Prisma } from "@prisma/client";
import { InputType, Field } from "type-graphql";
import { OrderByDirectionInput } from "./../common";

@InputType()
export class RealmOrderByInput
  implements Partial<Prisma.RealmOrderByWithRelationInput>
{
  @Field(() => OrderByDirectionInput, { nullable: true })
  realmId?: Prisma.SortOrder;
  @Field(() => OrderByDirectionInput, { nullable: true })
  rarityRank?: Prisma.SortOrder;
  @Field(() => OrderByDirectionInput, { nullable: true })
  rarityScore?: Prisma.SortOrder;
}
