[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/uQnjZhZPfu)
[![Twitter](https://badgen.net/badge/icon/twitter?icon=twitter&label)](https://twitter.com/LootRealms)

![This is an image](/D_-100.jpg)

# StarkNet Indexer

_The is in active development and will change rapidly._

This app aims to index all events relevant to the Loot ecosystem running on StarkNet.
http://starknet.events/redoc

<details><summary> The Stack</summary>
- Apollo server
- typescript
- prisma
- postgres

</details>

<details><summary>How it works</summary>
1. Poll StarkNet for specific events.
2. Pipe events into postgres
3. Exposes a graphql endpoint for the client to consume

</details>

<details><summary>Requirements</summary>
- A recent version of Node.js
- prisma cli

</details>

<details><summary>Getting Setup</summary>

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

</details>

<details><summary>Adding New Models</summary>

1. Add schema to prisma/schema.prisma
2. Add new resolver
3. Add entitie & types
4. Run migration

</details>

<details><summary>Contributing</summary>

We encourage pull requests.

1. Create an issue to describe the improvement you're making. Provide as much detail as possible in the beginning so the team understands your improvement.
2. Fork the repo so you can make and test changes in your local repository. Test your changes.
3. Create a pull request and describe the changes you made.
4. Include a reference to the Issue you created.
   Monitor and respond to comments made by the team around code standards and suggestions. Most pull requests will have some back and forth.
5. If you have further questions, visit [#builders-chat](https://discord.com/invite/yP4BCbRjUs) in our discord and make sure to reference your issue number.

Thank you for taking the time to make our project better!

</details>

<details><summary>Tasks</summary>

1. Add schema to prisma/schema.prisma
2. Add new resolver
3. Add entitie & types
4. Run migration

</details>

<details><summary>Utils</summary>

http://starknet.events/docs#/events/get_events_api_v1_get_events_get
https://www.prisma.io/docs/concepts/components/prisma-client/crud

</details>

# Bibliotheca DAO repos

| Content       | Repository                                                                        | Description                                              |
| ------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **contracts** | [realms-contracts](https://github.com/BibliothecaForAdventurers/realms-contracts) | StarkNet/Cairo and Ethereum/solidity contracts.          |
| **ui, atlas** | [realms-react](https://github.com/BibliothecaForAdventurers/realms-react)         | All user-facing react code (website, Atlas, ui library). |
| **indexer**   | [starknet-indexer](https://github.com/BibliothecaForAdventurers/starknet-indexer) | A graphql endpoint for the Lootverse on StarkNet.        |
| **bot**       | [squire](https://github.com/BibliothecaForAdventurers/squire)                     | A Twitter/Discord bot for the Lootverse.                 |
| **subgraph**  | [loot-subgraph](https://github.com/BibliothecaForAdventurers/loot-subgraph)       | A subgraph (TheGraph) for the Lootverse on Eth Mainnet.  |
