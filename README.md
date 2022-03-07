# StarkNet Indexer

This app aims to index all events relevant to the Loot ecosystem running on StarkNet.
http://starknet.events/redoc

### Tech stack

- Apollo server
- typescript
- prisma
- postgres

---

## How it works

1. Poll StarkNet for specific events.
2. Pipe events into postgres
3. Exposes a graphql endpoint for the client to consume

---

## Requirements

- A recent version of Node.js
- prisma cli

---

## Setup

```
yarn

// start postgres docker. You will have to terminate a local postgres if it is running.
sudo service postgresql stop
docker-compose up

// run first time then after schema change
npx prisma migrate dev

// init test DB data. You will need to install ts-node
ts-node app/db/mockDB.ts

// start server
yarn start

```

Visit http://localhost:3333/graphql in your web browser.

---

### Adding new model

1. Add schema to prisma/schema.prisma
2. Add new resolver
3. Add entitie & types
4. Run migration

### TODO in order of priority:

1. Index Marketplace
2. Define game schema
3. Index game schema

### Utils

http://starknet.events/docs#/events/get_events_api_v1_get_events_get
https://www.prisma.io/docs/concepts/components/prisma-client/crud
