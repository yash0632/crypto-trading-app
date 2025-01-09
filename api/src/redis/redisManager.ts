import {createClient,RedisClientType} from 'redis'

export class RedisManager{
    private client: RedisClientType;
    private publisher :RedisClientType;
    
    private static Instance : RedisManager;
    public static isInitialized : boolean = false;
    

    private constructor(){
        this.client = createClient();
        this.publisher = createClient();
    }

    public static async initialize(){
        if(RedisManager.isInitialized){
            return;
        }
        RedisManager.Instance = new RedisManager();
        await RedisManager.Instance.client.connect();
        await RedisManager.Instance.publisher.connect();
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
        await this.publisher.lPush("messages",JSON.stringify({
            clientId:id,
            message:message
        }))
        return new Promise((resolve)=>{
            this.client.subscribe(id,(message)=>{
                this.client.unsubscribe(id);
                resolve(JSON.parse(message));
            })
            
        })
    }

}