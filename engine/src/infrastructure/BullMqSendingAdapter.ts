import {Queue} from 'bullmq'
import { RedisConfig } from './BullMqListeningAdapter';

export interface IBullMqSendingAdapter{
    pushMessage(message:any):Promise<void>
}

export class BullMqSendingAdapter implements IBullMqSendingAdapter{
    private messageQueue:Queue;


    constructor(queueName:string,redisConfig:RedisConfig){
        this.messageQueue = new Queue(queueName,{connection:redisConfig});
    }


    async pushMessage(message:any){
        this.messageQueue.add('db_controller',message);
    }
}