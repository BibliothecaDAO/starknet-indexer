import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import Express from "express";
import { buildSchema } from "type-graphql";
import { context } from "./context";

import {
  WalletResolver,
  RealmResolver,
  BuildingResolver,
  ResourceResolver,
  TroopResolver,
  DesiegeResolver,
  ExchangeRateResolver,
  RealmHistoryResolver,
  FoodResolver,
  ArmyResolver,
  TravelResolver
} from "./resolvers";
import { StarkNet } from "./indexer/Starknet";
import { RealmsL1Indexer } from "./indexer/RealmsL1Indexer";
import { LoreResolver } from "./resolvers/lore/LoreResolver";
import { LorePOIResolver } from "./resolvers/lore/LorePOIResolver";

import {
  AggregateRealmHistoryResolver,
  GroupByRealmHistoryResolver,
  FindManyWalletBalanceResolver
} from "@generated/type-graphql";
const main = async () => {
  const schema = await buildSchema({
    resolvers: [
      RealmResolver,
      TroopResolver,
      WalletResolver,
      BuildingResolver,
      ResourceResolver,
      ExchangeRateResolver,
      DesiegeResolver,
      RealmHistoryResolver,
      LoreResolver,
      LorePOIResolver,
      FoodResolver,
      AggregateRealmHistoryResolver,
      GroupByRealmHistoryResolver,
      ArmyResolver,
      TravelResolver,
      FindManyWalletBalanceResolver
    ],
    emitSchemaFile: true,
    validate: false,
    dateScalarMode: "timestamp"
  });

  const server = new ApolloServer({
    schema,
    context: context,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
  });

  const app = Express();

  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: 3333 }, () =>
    console.log(
      `🚀 Server ready and listening at ==> http://localhost:3333${server.graphqlPath}`
    )
  );
  const realmsL1Indexer = new RealmsL1Indexer(context);
  await realmsL1Indexer.start();

  if (process.env.NETWORK === "goerli") {
    await StarkNet().serverWillStart();
  }
};

main().catch((error) => {
  console.log(error, "error");
});
