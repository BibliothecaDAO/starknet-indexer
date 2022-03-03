import fetch from "node-fetch";
import { StarkNetResponse } from "../types";
import { contract, fromBlock, name } from "./utils";
import { DesiegeResolver } from "../resolvers/Desiege";
import { context } from "../context";
const StarkNetUrl = "http://starknet.events/api/v1/get_events";

const Desiege = new DesiegeResolver();

const DesiegeAddress =
    "0x40098a0012c879cf85e0909ca10108197d9bf3970e6c2188641697f49aca134";

// fetch last indexed block
// fetch contract and events from last indexer block
// loop through items & update game state or create new game
// if more pages fetch page and continue
// if no more pages, store last block number
const desiegeQuery: string =
    StarkNetUrl +
    contract(DesiegeAddress) +
    fromBlock(60000) +
    name("game_action");
// const getLastIndexBlock = async (query: string) => {
//     try {
//         const response = await fetch(query);
//     } catch (e) {
//         console.log(e)
//     }
// }

const FetchStarkNet = async () => {
    try {
        const response = await fetch(desiegeQuery);
        const { items }: StarkNetResponse = await response.json();

        const games = await Desiege.allDesiege(context)

        if (games[0]?.blockIndexed === items[items.length - 1].block_number) return

        for (const item of items) {
            // const tokenId = item.parameters?.find(a => a.name === "token_id")?.value || 0
            const tokenOffset = Number(item.parameters?.find(a => a.name === "token_offset")?.value!) || 0
            const tokenAmount = Number(item.parameters?.find(a => a.name === "amount")?.value!) || 0

            await Desiege.createOrUpdateDesiege(
                {
                    gameId: Number(item.parameters?.find(a => a.name === "game_idx")?.value!),
                    winner: 0,
                    attackedTokens: tokenOffset === 1 ? tokenAmount : 0,
                    defendedTokens: tokenOffset === 2 ? tokenAmount : 0,
                    blockIndexed: item.block_number
                },
                context
            );
        }


    } catch (e) {
        console.log(e);
    }
};

export const StarkNet = () => {
    return {
        async serverWillStart() {
            setInterval(await FetchStarkNet, 5000);
        },
    };
};
