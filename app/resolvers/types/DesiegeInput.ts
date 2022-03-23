// import { Prisma } from "@prisma/client";
import { InputType, Field } from "type-graphql";
import { Desiege } from "../../entities";

@InputType()
export class DesiegeInput implements Partial<Desiege> {
  @Field()
  gameId: number;
  @Field()
  winner: number;
  @Field()
  attackedTokens: number;
  @Field()
  defendedTokens: number;
  @Field()
  eventIndexed: number;
  @Field()
  initialHealth: number;
  @Field()
  startedOn: Date;
}

// @InputType()
// class IntFilter {
//   @Field({ nullable: true })
//   equals: number;
//   @Field(() => [Int], { nullable: true })
//   in: number[];
//   @Field(() => [Int], { nullable: true })
//   notIn: number[];
//   @Field({ nullable: true })
//   lt: number;
//   @Field({ nullable: true })
//   lte: number;
//   @Field({ nullable: true })
//   gt: number;
//   @Field({ nullable: true })
//   gte: number;
// }

// @InputType()
// export class DesiegeQueryFilter implements Partial<Prisma.DesiegeWhereInput> {
//   @Field(() => IntFilter, { nullable: true })
//   gameId: object;
// }

// @InputType()
// export class DesiegeQueryOpts {
//   @Field(() => DesiegeQueryFilter)
//   filter?: DesiegeInput;
// }
