import { Ticker } from "./types";

const BASE_URL = "wss://ws.backpack.exchange/"


export class SignalingManager {
    private ws : WebSocket;
    private bufferedMessages : any[] = [];
    private id : number;
    private initialized:boolean = false;
    private static Instance : SignalingManager;
    private callbacks : {[type:string]:{callback:any,id:string}[]} = {};

    private constructor(){
        this.ws = new WebSocket(BASE_URL);
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }

    public static getInstance(){
        if(!SignalingManager.Instance){
            SignalingManager.Instance = new SignalingManager();
        }
        return SignalingManager.Instance;
    }

    init(){
        this.ws.onopen=()=>{
            this.initialized = true;
            this.bufferedMessages.forEach((message)=>{
                this.ws.send(JSON.stringify(message));
            })
            this.bufferedMessages = [];
        }

        this.ws.onmessage=(event)=>{
            
            

            const message = JSON.parse(event.data);
            const type = message.data.e;
            if(this.callbacks[type]){
                this.callbacks[type].forEach(({callback})=>{
                    if(type === "bookTicker"){
                        const newTicker : Partial<Ticker> = {
                            lastPrice: message.data.a,
                            symbol: message.data.s,
                            low : message.data.B,
                            high: message.data.A,
                            volume: message.data.u
                        }
                        //console.log(newTicker);
                        callback(newTicker);
                        
                    }
                    if(type === "depth"){
                        
                        
                        
                        const newDepth = {
                            asks:message.data.a,bids:message.data.b
                        };             
                        callback(newDepth);
                    }
                    
                })
            }
            
                    
            
            
        }
    }

    


    sendMessage(message:any){
        const messageToSend={
            ...message,
            id:this.id++
        }

        if(this.initialized == false){
            this.bufferedMessages.push(messageToSend);
            return;
        }


        this.ws.send(JSON.stringify(messageToSend))
    }


    async registerCallback(type:string,callback:()=>void,id:string){
        if(this.callbacks[type] == undefined){
            this.callbacks[type] = [];
        }
        this.callbacks[type].push({callback,id})
    }

    async deregisterCallback(type:string,id:string){
        if(this.callbacks[type]){
            this.callbacks[type].forEach((obj)=>{
                if(obj.id == id){
                    this.callbacks[type].splice(this.callbacks[type].indexOf(obj),1);
                }
            })
        }
    }
}