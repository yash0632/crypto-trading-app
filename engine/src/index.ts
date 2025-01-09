import { createClient } from "redis";
import Engine from "./trade/Engine";

async function startEngine(){
    const engine = new Engine();
    const redisClient = createClient();
    await redisClient.connect();

    

}

startEngine();