import { registerEnumType } from "type-graphql";

export enum OrderByDirectionInput {
  asc = "asc",
  desc = "desc"
}

registerEnumType(OrderByDirectionInput, {
  name: "OrderByDirectionInput",
  description: "Order By Direction"
});
