import fetch from "node-fetch";
import { DesiegeResolver } from "../resolvers/Desiege";
import { context } from "../context";
const StarkNetUrl = "http://starknet.events/api/v1/get_events";

const Desiege = new DesiegeResolver();

const DesiegeAddress =
    "0x40098a0012c879cf85e0909ca10108197d9bf3970e6c2188641697f49aca134";

const contract = (addr: string) => {
    return "?contract=" + addr;
};

// const fromBlock = (from: number) => {
//     return '?from_block=' + from
// }

// const toBlock = (to: number) => {
//     return '?to_block=' + to
// }

// const name = (names: string) => {
//     return "?name=" + names;
// };

const FetchStarkNet = async () => {
    try {
        const response = await fetch(
            StarkNetUrl + contract(DesiegeAddress)
        );

        console.log(response)

        await Desiege.createOrUpdateDesiegeGame(
            {
                gameId: 1,
                winner: 1,
                attackedTokens: 1,
                defendedTokens: 1,
                totalDamage: 1,
                totalShieldBoost: 1,
            },
            context
        );

    } catch (e) {
        console.log(e)
    }
};

export const StarkNet = () => {
    return {
        async serverWillStart() {
            setInterval(await FetchStarkNet, 20000);
        },
    };
};
