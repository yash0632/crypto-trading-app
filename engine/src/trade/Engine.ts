import {IRedisManager} from "../infrastructure/RedisManager"
import { MessageFromApi , CREATE_ORDER , CANCEL_ORDER, ON_RAMP, GET_DEPTH, GET_OPEN_ORDERS} from "../types/fromApi";

export interface IEngine{
    process(data:any):Promise<void>
}


class Engine implements IEngine{
    
    private redisManager : IRedisManager
    
    constructor(redisManager:IRedisManager){
        this.redisManager = redisManager;
    }

    async process({message,clientId}:{message:MessageFromApi,clientId:string}):Promise<void>{
        switch(message.type){
            case CREATE_ORDER:
                
                break;
            case CANCEL_ORDER:
                break;
            case ON_RAMP:
                break;
            case GET_DEPTH:
                break;
            case GET_OPEN_ORDERS:
                break;
            default:
                break

        }
    }

    
}

export default Engine