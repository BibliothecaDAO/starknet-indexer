import { Field, InputType, registerEnumType } from "type-graphql";
import { __Type } from "graphql";
import { OrderType } from "@prisma/client";

registerEnumType(OrderType, {
  name: "OrderType"
});

@InputType()
export class OrderTypeInput {
  @Field(() => OrderType, { nullable: true })
  equals?: OrderType;
  @Field(() => [OrderType], { nullable: true })
  in?: [OrderType];
  @Field(() => [OrderType], { nullable: true })
  notIn?: [OrderType];
  @Field(() => [OrderType], { nullable: true })
  not?: OrderType;
}
