import { Queue } from "bullmq";

export interface IMessageQueue{
    push(message:any):Promise<void>
}

export class BullMqAdapter implements IMessageQueue{
    private queue :Queue
    
    
    constructor(queueName:string,redisConfig:any){
        this.queue = new Queue(queueName,{connection:redisConfig})
    }




    async push(message:any){
        this.queue.add('messages',message)
    }
}

