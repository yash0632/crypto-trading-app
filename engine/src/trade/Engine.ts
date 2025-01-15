
import {IRedisManager} from "../infrastructure/RedisManager"
import { MessageFromApi , CREATE_ORDER , CANCEL_ORDER, ON_RAMP, GET_DEPTH, GET_OPEN_ORDERS} from "../types/fromApi";
import {IFill, OrderBook,IOrder} from './OrderBook'

import { ORDER_UPDATE, TRADE_ADDED } from "../types/index";
import { IBullMqSendingAdapter } from "../infrastructure/BullMqSendingAdapter";

export interface IEngine{
    process(data:any):Promise<void>
    
}

interface IUserBalance {
    [key:string]:{
        available:number,
        locked:number
    }
}
class Engine implements IEngine{
    
    private messagePubSub : IRedisManager
    private orderBooks : OrderBook[] = [];
    private balances : Map<string,IUserBalance> = new Map();
    private messageQueue : IBullMqSendingAdapter
    
    constructor(messagePubSub:IRedisManager,messageQueue:IBullMqSendingAdapter){
        this.messagePubSub = messagePubSub;
        this.messageQueue = messageQueue;
        
    }

    async process({message,clientId}:{message:MessageFromApi,clientId:string}):Promise<void>{
        switch(message.type){
            case CREATE_ORDER:
                try{
                    const {executedQty,fills,orderId} =  this.createOrder(message.data.market,message.data.price,message.data.quantity,message.data.side,message.data.userId)
                    this.messagePubSub.sendToApi(clientId,{
                        executedQty,
                        fills,
                        orderId
                    })
                } catch(e){
                    console.log(e);
                    this.messagePubSub.sendToApi(clientId,{
                        orderId:"",
                        executedQty:"0",
                        fills:[]
                    })
                }
                
                break;
            case CANCEL_ORDER:
                this.cancelOrder(message.data.market,message.data.orderId)
                break;
            case ON_RAMP:
                this.onRamp(message.data.market,message.data.userId);
                break;
            case GET_DEPTH:
                this.getDepth(message.data.market)
                break;
            case GET_OPEN_ORDERS:
                this.getOpenOrders(message.data.market,message.data.userId)
                break;
            default:
                break

        }
    }

    createOrder(
        market:string,
        price:string,
        quantity:string,
        side:"buy"|"sell",
        userId:string
    ){  
        const orderBook = this.orderBooks.find(orderBook => orderBook.ticker()== market);
        if(!orderBook){
            throw new Error("No order book found for " + market)
        }
        const baseAsset = market.split("_")[0];
        const quoteAsset = market.split("_")[1];

        //CheckAndLockFunds
        this.checkAndLockFunds(side,quoteAsset,baseAsset,userId,quantity,price)
        
        //addOrder
        const order = {
            userId,
            side,
            price : Number(price),
            quantity : Number(price),
            orderId:Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15),
            filled:0
        }

        const {fills,executedQty} = orderBook.addOrder(order);
        this.updateBalance(fills,userId,side,quoteAsset,baseAsset);
        this.createDbTrades(fills,market,userId);
        this.updateDbTrades(fills,market,order,executedQty)
        //send ws depth updates

    }

    cancelOrder(
        orderId:string,
        market:string
    ){

    }
    
    onRamp(
        userId:string,
        market:string
    ){

    }

    getDepth(
        market:string
    ){

    }

    getOpenOrders(
        market:string,
        userId:string
    ){

    }

    checkAndLockFunds(side:"buy"|"sell",quoteAsset:string,baseAsset:string,userId:string,quantity:string,price:string){
        if(side == "buy"){
            //check for funds
            if((this.balances.get(userId)?.[quoteAsset]?.available || 0) < Number(price) * Number(quantity)){
                throw new Error("Insufficient funds");
            }
            //@ts-ignore
            this.balances.get(userId)[quoteAsset].available = this.balances.get(userId)[quoteAsset].available - (Number(price) * Number(quantity));
            //1 user has solana and inr which are locked ond available
            //@ts-ignore
            this.balances.get(userId)[quoteAsset].locked = this.balances.get(userId)[quoteAsset].locked + (Number(price) * Number(quantity));
        }
        if(side == "sell"){
            //check for funds
            if((this.balances.get(userId)?.[baseAsset]?.available || 0) < Number(quantity)){
                throw new Error("Insufficient funds");
            }
            //@ts-ignore
            this.balances.get(userId)[baseAsset].available = this.balances.get(userId)[baseAsset].available - Number(quantity);
            //1 user has solana and inr which are locked ond available
            //@ts-ignore
            this.balances.get(userId)[baseAsset].locked = this.balances.get(userId)[baseAsset].locked + Number(quantity);
        }
    }


    updateBalance(fills:IFill[],userId:string,side:"buy"|"sell",quoteAsset:string,baseAsset:string){
        if(side == "buy"){
            
            
            fills.forEach(fill=>{
               
                //@ts-ignore
                this.balances.get(fill.otherUserId)[quoteAsset].available = this.balances.get(fill.otherUserId)[quoteAsset].available + (Number(price) * quantity);
                
                //@ts-ignore
                this.balances.get(fill.otherUserId)[baseAsset].locked = this.balances.get(fill.otherUserId)[baseAsset].locked - quantity;

                
                //@ts-ignore
                this.balances.get(userId)[baseAsset].available = this.balances.get(userId)[baseAsset].available + fill.quantity;

                //@ts-ignore
                this.balances.get(userId)[quoteAsset].locked = this.balances.get(userId)[quoteAsset].locked - (Number(fill.price) * fill.quantity);

            })
        }
        else{
            fills.forEach((fill)=>{
                
                //@ts-ignore
                this.balances.get(fill.otherUserId)[baseAsset].locked = this.balances.get(fill.otherUserId)[baseAsset].locked - (Number(fill.price) * quantity);

                //@ts-ignore
                this.balances.get(fill.otherUserId)[quoteAsset].available = this.balances.get(fill.otherUserId)[quoteAsset].available + quantity;

                

                //@ts-ignore
                this.balances.get(userId)[baseAsset].locked = this.balances.get(userId)[baseAsset] - fill.quantity;

                //@ts-ignore
                this.balances.get(userId)[quoteAsset].available = this.balances.get(userId)[quoteAsset] + (Number(fill.price) * fill.quantity);
            })
           
            
        }
    }

    createDbTrades(fills:IFill[],market:string,userId:string){
        fills.forEach((fill)=>{
            this.messageQueue.pushMessage({
                type:TRADE_ADDED,
                data:{
                    market:market,
                    price:fill.price,
                    quantity:fill.quantity.toString(),
                    QuoteQuantity : (Number(fill.price) * fill.quantity).toString(),
                    isBuyerMaker:fill.otherUserId == userId,
                    tradeId:fill.tradeId.toString(),
                    timeStamp:new Date()
                }

            })
        })
    }

    updateDbTrades(fills:IFill[],market:string,order:IOrder,executedQty:number){
        this.messageQueue.pushMessage({
            type:ORDER_UPDATE,
            data:{
                orderId:order.orderId,
                price:order.price,
                quantity:order.quantity,
                executedQty:executedQty,
                market:market,
                side:order.side
            }
        })
        fills.forEach((fill)=>{
            this.messageQueue.pushMessage({
                type:ORDER_UPDATE,
                data:{
                    orderId:fill.marketOrderId,
                    executedQty:fill.quantity,
                }
            })
        })
    }

    publishWsDepthUpdates(side:"buy"|"sell",market:string,fills:IFill[],price:string){
        const orderBook = this.orderBooks.find(orderBook=>orderBook.ticker() === market);
        if(!orderBook)return;

        const depth = orderBook.getDepth();
        if(side == "buy"){
            const updatedBid = depth.bids.filter((bid)=>{
                return bid[0] == price;
            })
            

            const updatedAsks = fills.map(fill=>{
                const newAsk = depth.asks.find((ask)=>ask[0] == fill.price);
                if(!newAsk){
                    return [fill.price,"0"];
                }
                else{
                    return [fill.price,newAsk[1]];
                }
            })

            this.messagePubSub.publishMessage(`depth.200ms.${market}`,{
                stream:`depth.200ms.${market}`,
                data:{
                    a:updatedAsks,
                    b:updatedBid,
                    e:"depth",
                    s:`${market}`
                }
            })


        }
        else{
            const updatedAsk = depth.asks.filter((ask)=>ask[0] == price);
            const updatedBids = fills.map((fill)=>{
                const newBid = depth.bids.find((bid)=>bid[0] == fill.price);
                if(!newBid){
                    return [fill.price,"0"];
                }
                else{
                    return [fill.price,newBid[1]];
                }
            })

            this.messagePubSub.publishMessage(`depth.200ms.${market}`,{
                stream:`depth.200ms.${market}`,
                data:{
                    a:updatedAsk,
                    b:updatedBids,
                    e:"depth",
                    s:`${market}`
                }
            })

        }
    }
}

export default Engine