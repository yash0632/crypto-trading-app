import axios from "axios";

const BASE_URL = "https://exchange-proxy.100xdevs.com/api/v1";

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
    marketOrderId:string,
    otherUserId:string
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
            this.bids.push(order);
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
                const filledQty = Math.min(quantity-executedQty,this.asks[i].quantity - this.asks[i].filled);
                executedQty += filledQty;
                this.asks[i].filled += filledQty;
                fills.push({
                    price:this.asks[i].price.toString(),
                    quantity:filledQty,
                    tradeId:++this.lastTradeId,
                    otherUserId:this.asks[i].userId,
                    marketOrderId:this.asks[i].orderId
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
                const selledAmount = Math.min(order.quantity - executedQty,this.bids[i].quantity - this.bids[i].filled);
                executedQty += selledAmount;
                this.bids[i].filled += selledAmount;
                fills.push({
                    price:this.bids[i].price.toString(),
                    quantity:selledAmount,
                    tradeId:++this.lastTradeId,
                    otherUserId:this.bids[i].userId,
                    marketOrderId:this.bids[i].orderId
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


    getDepth(){
        const bids :[string,string][] = [];
        const asks :[string,string][] = [];

        //this.bids ->[price,quantity,filled]
        const bidsObj :{[key:string]:number} = {}
        const asksObj :{[key:string]:number} = {}

        this.asks.forEach(ask=>{
            if(!asksObj[ask.price]){
                asksObj[ask.price] = 0;
            }
            asksObj[ask.price] += (ask.quantity - ask.filled);
        })

        this.bids.forEach(bid=>{
            if(!bidsObj[bid.price]){
                bidsObj[bid.price] = 0;
            }
            bidsObj[bid.price] += (bid.quantity - bid.filled);
        })


        Object.keys(asksObj).forEach((price)=>{
            asks.push([price,asksObj[price].toString()])
        })

        Object.keys(bidsObj).forEach((price)=>{
            bids.push([price,bidsObj[price].toString()]);
        })

        return {
            asks:asks,
            bids:bids
        }
    }

    getOrderById(orderId:string):IOrder|null{
        const order = this.asks.find(order => order.orderId == orderId) || this.bids.find(order=>order.orderId == orderId);
        return order || null;
    }

    cancelOrder(orderId:string){
        const order = this.asks.find(order => order.orderId == orderId) || this.bids.find(order=>order.orderId == orderId);
        if(!order){
            return;
        }
        
        if(order.side == "buy"){
            this.bids.splice(this.bids.indexOf(order),1);
        }
        else{
            this.asks.splice(this.asks.indexOf(order),1);
        }

        

    }
}