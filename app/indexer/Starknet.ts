import fetch from "node-fetch";
import { DesiegeResolver } from "../resolvers/Desiege";
import { context } from "../context";
const StarkNetUrl = "http://starknet.events/api/v1/get_events";

const Desiege = new DesiegeResolver();

const DesiegeAddress =
    "0x7970474671fdc6139e7a519f3c8efd869e559c02833a805dd5358bdf0af4dcb";

const contract = (addr: string) => {
    return "?contract=" + addr;
};

// const fromBlock = (from: number) => {
//     return '?from_block=' + from
// }

// const toBlock = (to: number) => {
//     return '?to_block=' + to
// }

const name = (names: string) => {
    return "?name=" + names;
};

const FetchStarkNet = async () => {
    await Desiege.createOrUpdateDesiegeGame(
        {
            id: 1,
            winner: 1,
            attackedTokens: 1,
            defendedTokens: 1,
            totalDamage: 1,
            totalShieldBoost: 1,
        },
        context
    );
    const response = await fetch(
        StarkNetUrl + contract(DesiegeAddress) + name("attack")
    );
    const x = await response.json();
    console.log(x);
    return x;
};

export const StarkNet = () => {
    return {
        async serverWillStart() {
            setInterval(await FetchStarkNet, 20000);
        },
    };
};
