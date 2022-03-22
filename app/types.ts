export interface StarkNetResponse {
  items: Array<StarkNetEvent>;
  page: number;
  size: number;
  total: number;
}

export interface StarkNetEvent {
  event_id: number;
  block_number?: number;
  chain_id?: string;
  contract?: string;
  keys?: Array<string>;
  name?: string;
  parameters?: Array<number>;
  timestamp?: Date;
  tx_hash?: string;
  status?: number;
}

export interface StarkNetEventParameter {
  name?: string;
  value?: string;
}

export interface Indexer<T> {
  contracts(): string[];
  index(items: T[]): Promise<void>;
  lastIndexId(): Promise<number>;
}
