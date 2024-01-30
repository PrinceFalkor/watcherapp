export type pNFT = {
    auction?: string,
    bids: any[],
    collection: {
        contract_address: string,
        symbol: string,
    },
    id: string,
    image: string,
    last_sale?: any,
    name: string,
    rarity?: {
        score?: number,
        rank?: number
    }
}

export interface getWalletHoldingsApiResponse {
    address: string,
    bids: any[],
    domain?: string,
    nfts: pNFT[]
}