import {RedisClientType,createClient}  from 'redis'
import { IEngine } from '../trade/Engine';

export interface IRedisManager{
    messagePubSub : RedisClientType
    connect():Promise<void>;
    sendToApi(clientId:string,message:any):void
    publishMessage(channel:string,message:any):void
}

export class RedisManager implements IRedisManager{
    messagePubSub : RedisClientType;
    
    constructor(){
        this.messagePubSub = createClient();
    }

    async connect(){
        await this.messagePubSub.connect();
    }
    
    public sendToApi(clientId:string,message:any){
        this.messagePubSub.publish(clientId,JSON.stringify(message))
    }

    public publishMessage(channel:string,message:any){
        this.messagePubSub.publish(channel,JSON.stringify(message));
    }

    

}