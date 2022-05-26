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
  BuildingCostResolver,
  // RealmTraitResolver,
  DesiegeResolver,
  ExchangePriceResolver
} from "./resolvers";
import { StarkNet } from "./indexer/Starknet";
import { RealmsL1Indexer } from "./indexer/RealmsL1Indexer";
import {
  EventCrudResolver
  // DesiegeCrudResolver,
  // LoreEntityCrudResolver,
  // LoreEntityRelationsResolver,
  // LoreEntityRevisionRelationsResolver
} from "@generated/type-graphql";
import { LoreResolver } from "./resolvers/lore/Lore";
import { LorePOIResolver } from "./resolvers/lore/LorePOI";
// import { LoreResolver } from "./resolvers/lore/Lore";

const main = async () => {
  const schema = await buildSchema({
    resolvers: [
      RealmResolver,
      WalletResolver,
      BuildingResolver,
      ResourceResolver,
      BuildingCostResolver,
      ExchangePriceResolver,
      // Generated
      DesiegeResolver,
      // DesiegeCrudResolver,
      EventCrudResolver,
      LoreResolver,
      LorePOIResolver
      // LoreEntityCrudResolver,
      // LoreEntityRelationsResolver,
      // LoreEntityRevisionRelationsResolver
    ],
    emitSchemaFile: true,
    validate: false
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
  await StarkNet().serverWillStart();
};

main().catch((error) => {
  console.log(error, "error");
});
