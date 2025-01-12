import { isThisTypeNode } from "typescript";
import {IRedisManager} from "../infrastructure/RedisManager"
import { MessageFromApi , CREATE_ORDER , CANCEL_ORDER, ON_RAMP, GET_DEPTH, GET_OPEN_ORDERS} from "../types/fromApi";
import {OrderBook} from './OrderBook'

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
    
    private redisManager : IRedisManager
    private orderBooks : OrderBook[] = [];
    private balances : Map<string,IUserBalance> = new Map();
    
    constructor(redisManager:IRedisManager){
        this.redisManager = redisManager;
        
    }

    async process({message,clientId}:{message:MessageFromApi,clientId:string}):Promise<void>{
        switch(message.type){
            case CREATE_ORDER:
                try{
                    const {executedQty,fills,orderId} =  this.createOrder(message.data.market,message.data.price,message.data.quantity,message.data.side,message.data.userId)
                    this.redisManager.sendToApi(clientId,{
                        executedQty,
                        fills,
                        orderId
                    })
                } catch(e){
                    console.log(e);
                    this.redisManager.sendToApi(clientId,{
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
}

export default Engine