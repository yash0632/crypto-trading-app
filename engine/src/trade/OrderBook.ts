export const BASE_CURRENCY = "INR"
export 

export class OrderBook{
    private bids:[];
    private asks:[];
    private quoteAsset:string = BASE_CURRENCY;
    private baseAsset:string;

    constructor(bids:[],asks:[],quoteAsset:string,baseAsset:string){
        this.bids = bids;
        this.asks =asks;
        this.quoteAsset = quoteAsset;
        this.baseAsset = baseAsset;
    }

    ticker(){
        return `${this.baseAsset}_${this.quoteAsset}`
    }

    addOrder(order:)
}