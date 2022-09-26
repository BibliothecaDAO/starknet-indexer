import { NETWORK } from "./../utils/constants";
import fetch from "node-fetch";
import { StarkNetEvent } from "./../types";
// import { BigNumber } from "ethers";

const StarknetVoyagerApiUrl = "https://goerli.voyager.online/api";

interface StarknetVoyagerApiResponse {
  items: Array<StarknetVoyagerEvent>;
  hasMore: boolean;
}

interface StarknetVoyagerEvent {
  id: string;
  block_number?: number;
  transaction_number?: number;
  transactionHash: string;
  contract: string;
  blockHash?: string;
  fromAddress?: string;
  status?: string;
}

type FetchOptions = {
  page: number;
  contract: string;
};

const PAGE_SIZE = 50;

export default class StarknetVoyagerApi {
  private chainId: string;
  private cache: { [key: string]: any } = {};
  constructor() {
    this.chainId = NETWORK;
  }

  async fetch(
    opts: FetchOptions,
    lastEventId?: string
  ): Promise<StarknetVoyagerApiResponse> {
    const response = {
      items: [] as StarknetVoyagerEvent[],
      hasMore: false
    };
    try {
      const url = `${StarknetVoyagerApiUrl}/events?contract=${opts.contract}&p=${opts.page}&ps=${PAGE_SIZE}`;
      const voyagerResponse = await fetch(url, { timeout: 20000 });
      const data = await voyagerResponse.json();
      response.items = data.items.map((item: StarknetVoyagerEvent) => ({
        ...item,
        contract: opts.contract
      }));
      if (lastEventId) {
        response.items = response.items.filter((item) => item.id > lastEventId);
      }
      response.hasMore =
        data.lastPage > opts.page && response.items.length === PAGE_SIZE;
    } catch (e) {}
    return response;
  }

  async fetchEventDetails(
    voyagerEvent: StarknetVoyagerEvent
  ): Promise<StarkNetEvent> {
    const url = `${StarknetVoyagerApiUrl}/txn/${voyagerEvent.transactionHash}`;

    let details: any = this.cache[voyagerEvent.transactionHash];
    if (!details) {
      const response = await fetch(url, { timeout: 20000 });
      details = await response.json();
      if (details.receipt.events.length > 0) {
        this.cache[voyagerEvent.transactionHash] = details;
      }
    }

    const eventDetails = details.receipt.events.find(
      (ev: any) => ev.id === voyagerEvent.id
    );
    // const toAddress = details.header.to
    //   ? BigNumber.from(details.header.to).toHexString()
    //   : "";

    return {
      name: "",
      chainId: this.chainId,
      eventId: voyagerEvent.id,
      blockNumber: voyagerEvent.block_number,
      transactionNumber: voyagerEvent.transaction_number,
      contract: voyagerEvent.contract,
      transactionHash: voyagerEvent.transactionHash,
      timestamp: new Date(details.header.timestamp * 1000),
      // toAddress,
      parameters: eventDetails ? eventDetails.data : [],
      keys: eventDetails ? eventDetails.keys : []
    };
  }

  purgeCache() {
    this.cache = {};
  }
}
