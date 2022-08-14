import fetch from "node-fetch";

const INFURA_URL =
  "https://starknet-goerli.infura.io/v3/" + process.env.INFURA_API_KEY;

type RpcMethod =
  | "getEvents"
  | "getTransactionReceipt"
  | "getTransactionByHash"
  | "getBlockByNumber"
  | "blockNumber";

interface EventFilter {
  address: string;
  fromBlock?: number;
  page_number?: number;
  page_size?: number;
}

class Cache {
  private items: Map<string, any>;
  private max: number;

  constructor(max: number) {
    this.items = new Map();
    this.max = max;
  }

  get(key: string) {
    let item = this.items.get(key);
    if (item) {
      this.items.delete(key);
      this.items.set(key, item);
    }
    return item;
  }

  set(key: string, val: any) {
    if (this.items.has(key)) this.items.delete(key);
    else if (this.items.size == this.max)
      this.items.delete(this.items.keys().next().value);
    this.items.set(key, val);
  }
}

export default class StarknetRpcProvider {
  private blockCache: Cache;
  private txCache: Cache;
  private txReceiptCache: Cache;

  constructor() {
    this.blockCache = new Cache(1000);
    this.txCache = new Cache(1000);
    this.txReceiptCache = new Cache(1000);
  }

  createRequestBody(method: RpcMethod, params: any[]): any {
    return {
      jsonrpc: "2.0",
      id: 1,
      method: `starknet_${method}`,
      params
    };
  }

  async fetch(requestBody: any) {
    try {
      const resp = await fetch(INFURA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      const data = await resp.json();
      if (!data || !data.result) {
        console.error(data);
        return null;
      }
      return data.result;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getEvents(filter: EventFilter) {
    if (!filter.fromBlock) {
      filter.fromBlock = 0;
    }

    const requestBody = this.createRequestBody("getEvents", [filter]);
    const data = await this.fetch(requestBody);
    return data;
  }

  async blockNumber() {
    const requestBody = this.createRequestBody("blockNumber", []);
    const data = await this.fetch(requestBody);
    return data;
  }

  async getTransactionByHash(txHash: string) {
    let data = this.txCache.get(txHash);
    if (data) {
      return data;
    }
    const requestBody = this.createRequestBody("getTransactionByHash", [
      txHash
    ]);
    data = await this.fetch(requestBody);

    if (!data) {
      return null;
    }
    this.txCache.set(txHash, data);
    return data;
  }

  async getTransactionReceipt(txHash: string) {
    let data = this.txReceiptCache.get(txHash);
    if (data) {
      return data;
    }
    const requestBody = this.createRequestBody("getTransactionReceipt", [
      txHash
    ]);
    data = await this.fetch(requestBody);

    if (!data) {
      return null;
    }
    this.txReceiptCache.set(txHash, data);
    return data;
  }

  async getBlockByNumber(blockNumber: number) {
    let data = this.blockCache.get(String(blockNumber));
    if (data) {
      return data;
    }
    const requestBody = this.createRequestBody("getBlockByNumber", [
      blockNumber
    ]);
    data = await this.fetch(requestBody);
    if (!data) {
      return null;
    }
    this.blockCache.set(String(blockNumber), data);
    return data;
  }
}
