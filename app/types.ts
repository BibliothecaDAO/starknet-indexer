export interface StarkNetResponse {
    items: Array<Item>
    page: number
    size: number
    total: number
}

export interface Item {
    block_number: number
    chain_id?: string
    contract?: string
    keys?: Array<string>
    name?: string
    parameters?: Array<StarkNetEvent>
    timestramp?: Date
    tx_hash?: string
}

export interface StarkNetEvent {
    name?: string
    value?: string
}