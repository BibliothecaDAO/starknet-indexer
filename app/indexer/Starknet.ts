import fetch from 'node-fetch';
import { RealmResolver } from '../resolvers/Realm';
import { context } from '../context'
const StarkNetUrl = "http://starknet.events/api/v1/get_events"

const Realm = new RealmResolver()

const Desiege = '0x26fb3d6ae270ee3c2fedd8d6d0576b15edd6abe6afa93c9e847a306648e9e95'

const contract = (addr: string) => {
    return '?contract=' + addr
}

const fromBlock = (from: number) => {
    return '?from_block=' + from
}

const toBlock = (to: number) => {
    return '?to_block=' + to
}

const name = (names: string) => {
    return '?name=' + names
}

const FetchStarkNet = async () => {
    await Realm.createRealm({ name: "test" }, context)
    const response = await fetch(StarkNetUrl + contract(Desiege) + name('attack'));
    const x = await response.json();
    console.log(x);
    return x
}

export const StarkNet = () => {
    return {
        async serverWillStart() {
            setInterval(await FetchStarkNet, 20000);
        },
    };
};