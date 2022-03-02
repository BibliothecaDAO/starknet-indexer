import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import Express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { context } from './context'
import { RealmResolver } from './resolvers/Realm';
import { DesiegeResolver } from './resolvers/Desiege';
import { StarkNet } from './indexer/Starknet';

const main = async () => {
  const schema = await buildSchema({
    resolvers: [
      RealmResolver,
      DesiegeResolver
    ],
    emitSchemaFile: true,
    validate: false,
  });


  const server = new ApolloServer({
    schema,
    context: context,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground, StarkNet],
  });

  const app = Express();

  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: 3333 }, () =>
    console.log(
      `🚀 Server ready and listening at ==> http://localhost:3333${server.graphqlPath}`
    )
  );
};

main().catch((error) => {
  console.log(error, 'error');
});
