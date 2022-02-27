# StarkNet Indexer

This app aims to index all events relevant to the Loot ecosystem running on StarkNet.

---

## How it works

1. Poll StarkNet for specific events.
2. Pipe events into mongodb
3. Exposes a graphql endpoint for the client to consume

---

## Requirements

- A recent version of Node.js and npm
- A running MongoDB instance

---

## Setup

```
yarn

yarn build-ts

// Check MongoDB is running at `http://localhost:27017`

yarn start

```

Visit http://localhost:3333/graphql in your web browser.

---

### TODO in order of priority:

1. Index Marketplace
2. Define game schema
3. Index game schema
