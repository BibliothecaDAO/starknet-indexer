import fetch from "node-fetch";
import { StarkNetResponse } from "./../types";

const StarkNetUrl = "http://starknet.events/api/v1/get_events?";

export default function StarknetApi() {
  const params: string[][] = [];
  const module = {
    contract: (addr: string | string[]) => {
      let contracts = Array.isArray(addr) ? addr : [addr];
      for (let contract of contracts) {
        params.push(["contract", contract]);
      }
      return module;
    },
    fromBlock: (from: number) => {
      params.push(["from_block", `${from}`]);
      return module;
    },
    toBlock: (to: number) => {
      params.push(["to_block", `${to}`]);
      return module;
    },
    name: (name: string) => {
      params.push(["name", name]);
      return module;
    },
    size: (size: number) => {
      params.push(["size", `${size}`]);
      return module;
    },
    page: (page: number) => {
      params.push(["page", `${page}`]);
      return module;
    },
    async fetch(): Promise<StarkNetResponse> {
      const url =
        StarkNetUrl +
        params.map((param) => `${param[0]}=${param[1]}`).join("&");
      const response = await fetch(url);
      return await response.json();
    }
  };
  return module;
}
