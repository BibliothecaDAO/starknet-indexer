import fetch from 'node-fetch';
import { UserResolver } from '../resolvers/User';

const StarkNetUrl = "http://starknet.events/api/v1/"

const User = new UserResolver()

const FetchStarknet = async () => {
    await User.createUser({ username: "test", email: "gmail" })
    const response = await fetch(StarkNetUrl + 'get_events?from_block=59100&name=FillOrder');
    const x = await response.json();
    console.log(x);
    return x
}

export const Starknet = () => {
    return {
        async serverWillStart() {
            setInterval(await FetchStarknet, 1000);
        },
    };
};