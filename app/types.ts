export interface StarkNetResponse {
  items: Array<StarkNetEvent>;
  page: number;
  size: number;
  total: number;
}

export interface StarkNetEvent {
  eventId: string;
  blockNumber?: number;
  transactionNumber?: number;
  chainId?: string;
  contract?: string;
  keys?: Array<string>;
  name?: string;
  parameters?: Array<string>;
  timestamp?: Date;
  transactionHash?: string;
  status?: number;
}

export interface StarkNetEventParameter {
  name?: string;
  value?: string;
}

export interface Indexer<T> {
  contracts(): string[];
  index(items: T[]): Promise<void>;
  lastEventId(): Promise<string>;
  lastBlockNumber(): Promise<number>;
  eventName?(selector: string): string;
}

export interface RealmEvent {
  eventId: string;
  eventType: string;
  realmId: number;
  bastionId?: number;
  account?: string;
  data: any;
  timestamp: Date;
  transactionHash: string;
}
