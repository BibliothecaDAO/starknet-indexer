export interface StarkNetResponse {
  items: Array<StarkNetEvent>;
  page: number;
  size: number;
  total: number;
}

export interface StarkNetEvent {
  block_number: number;
  chain_id?: string;
  contract?: string;
  keys?: Array<string>;
  name?: string;
  parameters?: Array<StarkNetEventParameter>;
  timestamp?: Date;
  tx_hash?: string;
}

export interface StarkNetEventParameter {
  name?: string;
  value?: string;
}

export interface Indexer {
  getContracts(): string[];
  updateIndex(events: StarkNetEvent[]): Promise<void>;
  getLastBlockIndexed(): Promise<number>;
}
