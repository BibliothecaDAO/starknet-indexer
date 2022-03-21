const cheerio = require("cheerio");
import fetch from "node-fetch";
import { StarkNetEvent } from "../types";

const StarknetVoyagerApiUrl = "https://goerli.voyager.online/api";
const StarknetTxInfoUrl = "https://starktx.info/goerli";

interface StarknetVoyagerApiResponse {
  items: Array<StarknetVoyagerEvent>;
  hasMore: boolean;
}

interface StarknetVoyagerEvent {
  blockHash: string;
  from_address: string;
  id: number;
  status: string;
  transactionHash: string;
  contract: string;
}

type FetchOptions = {
  page: number;
  contract: string;
};

export default class StarknetVoyagerApi {
  private chainId: string;
  private pageSize: 50;
  constructor() {
    this.chainId = "testnet";
  }

  async fetch(
    opts: FetchOptions,
    lastEventId?: number
  ): Promise<StarknetVoyagerApiResponse> {
    const response = {
      items: [] as StarknetVoyagerEvent[],
      hasMore: false
    };
    try {
      const url = `${StarknetVoyagerApiUrl}/events?contract=${
        opts.contract
      }&p=${opts.page}&ps=${50}`;
      console.log(url);
      const voyagerResponse = await fetch(url);
      const data = await voyagerResponse.json();
      response.items = data.items.map((item: StarknetVoyagerEvent) => ({
        ...item,
        contract: opts.contract
      }));
      if (lastEventId) {
        response.items = response.items.filter((item) => item.id > lastEventId);
      }
      response.hasMore =
        data.lastPage > opts.page && response.items.length === this.pageSize;
    } catch (e) {}
    return response;
  }

  async fetchEventDetails(
    voyagerEvent: StarknetVoyagerEvent
  ): Promise<StarkNetEvent> {
    const url = `${StarknetTxInfoUrl}/${voyagerEvent.transactionHash}/`;
    console.log(url);

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const blockInfo = $(".transaction-info").text().trim();
    const blockMatch = blockInfo.match(
      /[^\/]*\/([0-9]+)[^0-9]*(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\sUTC).*/
    );
    const calls = $("#ev_tree ul li p");
    const eventMatch = $(calls[0])
      .text()
      .trim()
      .match(/.*\.([^\(]*)\(([^\)]*)\)/);

    return {
      name: eventMatch[1],
      chain_id: this.chainId,
      event_id: voyagerEvent.id,
      contract: voyagerEvent.contract,
      block_number: parseInt(blockMatch[1]),
      timestamp: new Date(Date.parse(eventMatch[2])),
      parameters: eventMatch[2].split(", ").map((param: string) => ({
        name: param.split("=")[0],
        value: param.split("=")[1]
      }))
    };
  }
}
