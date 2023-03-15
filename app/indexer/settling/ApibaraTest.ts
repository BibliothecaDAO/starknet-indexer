// import { Event } from "../../entities/starknet/Event";
import { Context } from "../../context";
// import BaseContractIndexer from "../BaseContractIndexer";
// import { BuildingNameById } from "../../utils/game_constants";
import { Filter, FieldElement } from "@apibara/starknet";
// import { TransferStreamClient } from "../Apibara";
import { hash } from 'starknet'

import ApibaraBaseContractIndexer from "../Apibara";


export const CONTRACT =
  "0x01c7a86cea8febe69d688dd5ffa361e7924f851db730f4256ed67fd805ea8aa7";

export const address = FieldElement.fromBigInt(
  CONTRACT
);

const key = [
  FieldElement.fromBigInt(hash.getSelectorFromName('BuildingIntegrity'))
];

const filter = Filter.create()
.addEvent((ev: any) =>
    ev.withFromAddress(address).withKeys(key)
)
.encode();

export default class ApibaraTestBuildingIndexer extends ApibaraBaseContractIndexer {

  constructor(context: Context) {
    super(
      context, CONTRACT, filter
    );

    this.test();
  }

  async test(): Promise<void> {

    for await (const message of this.client) {
      // console.log(message)
      if (message.data?.data) {

        message.data.data.forEach((a)=> {
          console.log(a)
        })
        // handle data
        // console.log(message.data.data);
      }
    }
  }
}
