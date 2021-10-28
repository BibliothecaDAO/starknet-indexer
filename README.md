# Integrating TypeScript with GraphQL using Type-Graphl, a modern framework for building GraphQL APIs in Node.js

Tutorial: https://blog.logrocket.com/integrating-typescript-graphql/

## Requirements

- A recent version of Node.js and npm
- A running MongoDB instance

## Setup

- Install dependencies with `npm install`.
- Compile the application by running `npm run build-ts`.
- Make sure MongoDB is running at `http://localhost:27017`.
- Start the server with `npm start`.
- Visit http://localhost:3333/graphql in your web browser.

## Dependencies

- Typgoose, `@typegoose/typegoose` A library for defining Mongoose models using TypeScript classes.
- Type-Graphl, A library for creating GraphQL schema and resolvers with TypeScript, using `classes` and `decorators magic` :)!
- Apollo-server-express, `apollo-server-express`, A library for quickly bootstrapping graphql servers with Apollo and Express

For a note on other dependencies, please have a look at the `package.json` file.
