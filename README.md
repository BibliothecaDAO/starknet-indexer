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

- A recent version of Node.js and npm
- A running MongoDB instance

---

## Setup

```
yarn

// run this after every change
yarn build-ts

docker-compose up

yarn start

```

Visit http://localhost:3333/graphql in your web browser.

---

### TODO in order of priority:

1. Index Marketplace
2. Define game schema
3. Index game schema
