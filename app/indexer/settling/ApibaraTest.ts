// import { Event } from "../../entities/starknet/Event";
import { Context } from "../../context";
// import BaseContractIndexer from "../BaseContractIndexer";
// import { BuildingNameById } from "../../utils/game_constants";
import { Filter, FieldElement } from "@apibara/starknet";
// import { TransferStreamClient } from "../Apibara";
import { hash } from 'starknet'
import BaseContractIndexer from "../BaseContractIndexer";

import {
  StreamClient,
} from '@apibara/protocol'

export const address = FieldElement.fromBigInt(
  '0x01c7a86cea8febe69d688dd5ffa361e7924f851db730f4256ed67fd805ea8aa7'
);

export const CONTRACT =
  "0x01c7a86cea8febe69d688dd5ffa361e7924f851db730f4256ed67fd805ea8aa7";

const key = [
  FieldElement.fromBigInt(hash.getSelectorFromName('BuildingIntegrity'))
];

export default class ApibaraTestBuildingIndexer extends BaseContractIndexer {

  public readonly client: StreamClient;

  constructor(context: Context) {
    super(
      context, CONTRACT
    );

    this.client = new StreamClient({
      url: 'goerli.starknet.a5a.ch:443',
    })

    this.test();

    console.log(this.client)
  }

  async test(): Promise<void> {

    const filter = Filter.create()
    .addEvent((ev: any) =>
        ev.withFromAddress(address).withKeys(key)
    )
    .withStateUpdate((su: any) =>
        su.addStorageDiff((st: any) => st.withContractAddress(address))
    )
    .encode();

    await this.client.configure({
      filter,
      batchSize: 1,
      finality: 1
    })

    for await (const message of this.client) {
      // console.log(message)
      if (message.data?.data) {

        message.data.data.forEach((a)=> {
          console.log(a.toString())
        })
        // handle data
        // console.log(message.data.data);
      }
    }
  }
}
