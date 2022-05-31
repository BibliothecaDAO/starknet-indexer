import { NETWORK } from "../utils/constants";
import fetch from "node-fetch";
import { StarkNetEvent } from "../types";

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

    const response = await fetch(url, { timeout: 20000 });
    const details = await response.json();
    const eventDetails = details.receipt.events.find(
      (ev: any) => ev.id === voyagerEvent.id
    );

    //   data.map((value: any) => {
    //   return value.indexOf("0x") === 0 ? parseInt(value, 16) : parseInt(value);
    // });
    return {
      name: "",
      chainId: this.chainId,
      eventId: voyagerEvent.id,
      blockNumber: voyagerEvent.block_number,
      transactionNumber: voyagerEvent.transaction_number,
      contract: voyagerEvent.contract,
      transactionHash: voyagerEvent.transactionHash,
      timestamp: new Date(details.header.timestamp * 1000),
      toAddress: details.header.to ?? "",
      parameters: eventDetails ? eventDetails.data : [],
      keys: eventDetails ? eventDetails.keys : []
    };
  }
}
