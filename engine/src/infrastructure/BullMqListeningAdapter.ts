import {  Worker,Job } from "bullmq";
import { IEngine } from "../trade/Engine";

export interface IBullMqListeningAdapter{
    setupEventConnections():void
    processJobs(job:Job):Promise<void>
}

export interface RedisConfig{
    host:string,
    port:number
}

export class BullMqListeningAdapter implements IBullMqListeningAdapter{
    private worker : Worker;
    private engine : IEngine
    

    constructor(queueName:string,redisConfig:RedisConfig,engine:IEngine){
        this.engine = engine;
        this.worker = new Worker(queueName,
            async job => {
                await this.processJobs(job);
                console.log(job.data);
            },
            {connection:redisConfig}
        )
        this.setupEventConnections();
        
    }

    setupEventConnections(){
        this.worker.on('completed',job=>{
            console.log(`${job.id} has completed`)
        })
        this.worker.on('failed',(job,err)=>{
            console.log(`job has failed with ${err.message}`)
        })
    }

    async processJobs(job:Job){
        await this.engine.process(job.data)
    }

    
}