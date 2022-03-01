import fetch from 'node-fetch';
import { RealmResolver } from '../resolvers/Realm';
import { context } from '../context'
const StarkNetUrl = "http://starknet.events/api/v1/"

const Realm = new RealmResolver()

const FetchStarknet = async () => {
    await Realm.createRealm({ name: "test" }, context)
    const response = await fetch(StarkNetUrl + 'get_events?from_block=59100&name=FillOrder');
    const x = await response.json();
    console.log(x);
    return x
}

export const Starknet = () => {
    return {
        async serverWillStart() {
            setInterval(await FetchStarknet, 20000);
        },
    };
};