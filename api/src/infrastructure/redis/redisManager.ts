import {createClient,RedisClientType} from 'redis'
import {Queue} from 'bullmq'
import { IMessageQueue } from '../queue/BullMqAdapter';

export class RedisManager{
    private messageQueue: IMessageQueue;
    private messagePubSub :RedisClientType;
    
    private static Instance : RedisManager;
    public static isInitialized : boolean = false;
    

    private constructor(messageQueue:IMessageQueue){
        this.messageQueue = messageQueue;
        this.messagePubSub = createClient();
    }

    public static async initialize(messageQueue:IMessageQueue){
        if(RedisManager.isInitialized){
            return;
        }
        RedisManager.Instance = new RedisManager(messageQueue);
        await RedisManager.Instance.messagePubSub.connect();
        RedisManager.isInitialized = true;
        return;
    }

    public static getInstance(){
        if(RedisManager.isInitialized === false){
            console.log("RedisManager is not initialized");
            
        }
        return RedisManager.Instance;
    }
    
    public async sendAndAwait(message:any){
        const id =new Date().getTime().toString();
        await this.messageQueue.push({
            clientId:id,
            message:message
        })
        return new Promise((resolve)=>{
            this.messagePubSub.subscribe(id,(message)=>{
                this.messagePubSub.unsubscribe(id);
                resolve(JSON.parse(message));
            })
            
        })
    }

}