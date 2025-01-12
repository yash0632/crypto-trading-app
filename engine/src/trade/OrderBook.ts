export const BASE_CURRENCY = "INR"
export interface IOrder{
    side:"buy"|"sell",
    price:number,
    quantity:number,
    orderId:string,
    userId:string,
    filled:number
}

export interface IFill{
    price:string,
    quantity:number,
    tradeId:number,
    marketOrderId:number,
    otherUserId:number
}

export class OrderBook{
    private bids:IOrder[];
    private asks:IOrder[];
    private quoteAsset:string = BASE_CURRENCY;
    private baseAsset:string;
    private lastTradeId:number

    constructor(bids:[],asks:[],quoteAsset:string,baseAsset:string,lastTradeId:number){
        this.bids = bids;
        this.asks =asks;
        this.quoteAsset = quoteAsset;
        this.baseAsset = baseAsset;
        this.lastTradeId = lastTradeId || 0;
    }

    ticker(){
        return `${this.baseAsset}_${this.quoteAsset}`
    }

    addOrder(order:IOrder){
        if(order.side == "buy"){
            //buy solana
            //asks -> check karunga then reply karunga kitni bhar gaye uske baad
            //price,quantity -> kam huyi dekhlunga aur iss tak jitni bahrgayi ye to fills mein dalunga aur add karunga bids mein
            const {fills,executedQty} = this.matchBid(order);
            if(executedQty == order.quantity){
                return {
                    executedQty,
                    fills
                }
            }
            order.filled = executedQty;
            return {
                executedQty,
                fills
            }

            
        }
        else{
            const {fills,executedQty} = this.matchAsk(order);
            if(executedQty == order.quantity){
                return {
                    fills,
                    executedQty
                }
            }
            order.filled = executedQty;
            this.asks.push(order);
            return {
                fills,
                executedQty
            }
        }
    }

    matchBid(order:IOrder):{fills:IFill[],executedQty:number}{
        const fills :IFill[] = [];
        let executedQty = 0;
        let {price,quantity} = order;
        for(let i = 0;i < this.asks.length;i++){
            if(this.asks[i].price <= price && executedQty < quantity){
                const filledQty = Math.min(quantity-executedQty,this.asks[i].quantity);
                executedQty += filledQty;
                this.asks[i].filled += filledQty;
                fills.push({
                    price:this.asks[i].price.toString(),
                    quantity:filledQty,
                    tradeId:++this.lastTradeId,
                    otherUserId:Number(this.asks[i].userId),
                    marketOrderId:Number(this.asks[i].orderId)
                })
            }
        }

        while(this.asks.length > 0 && this.asks[0].filled ==this.asks[0].quantity){
            this.asks.splice(0,1);
        }
        

        return {
            fills,
            executedQty
        }
    }

    matchAsk(order:IOrder):{fills:IFill[],executedQty:number}{
        const fills :IFill[] = [];
        let executedQty = 0;
        //[[0.01,146],[0.02,147],[0.03,148],[3,220],[12,222]]
        //[13,220]

        for(let i = this.bids.length - 1;i >= 0;i--){
            if(this.bids[i].price >= order.price && executedQty < order.quantity){
                const selledAmount = Math.min(order.quantity - executedQty,this.bids[i].quantity);
                executedQty += selledAmount;
                this.bids[i].filled += selledAmount;
                fills.push({
                    price:this.bids[i].price.toString(),
                    quantity:selledAmount,
                    tradeId:++this.lastTradeId,
                    otherUserId:Number(this.bids[i].userId),
                    marketOrderId:Number(this.bids[i].orderId)
                })
            }   
        }

        //
        while(this.bids.length > 0 && this.bids[this.bids.length - 1].filled == this.bids[this.bids.length - 1].quantity){
            this.bids.splice(this.bids.length - 1,1);
        }


        return {
            fills,
            executedQty
        }
    }
}