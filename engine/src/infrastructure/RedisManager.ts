import {RedisClientType,createClient}  from 'redis'
import { IEngine } from '../trade/Engine';

export interface IRedisManager{
    messagePubSub : RedisClientType
    connect():Promise<void>;
}

export class RedisManager implements IRedisManager{
    messagePubSub : RedisClientType;
    
    constructor(){
        this.messagePubSub = createClient();
    }

    async connect(){
        await this.messagePubSub.connect();
    }
    


}