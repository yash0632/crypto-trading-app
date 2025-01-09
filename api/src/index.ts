import express,{Application} from 'express';
import cors from 'cors';
import orderRouter from './routes/orderRoutes';
import { RedisManager } from './redis/redisManager';

const app:Application = express();



app.use(cors({
    origin:["http://localhost:5173"],
    methods:"GET,POST,DELETE,UPDATE,PUT,PATCH",
}))

app.use(express.json());




async function startServer(){

    try{
        await RedisManager.initialize();
        
        app.use("/api/v1/order",orderRouter);
        app.use("/api/v1/klines",kLineRouter);
        app.use("/api/v1/depth",depthRouter);
        app.use("/api/v1/trade",tradeRouter);


        app.listen(3000,()=>{
            console.log(`Server is running on port 3000`);
        })
    }
    catch(e){
        console.error("Error Starting the server:",e);
        process.exit(1);
    }
    
}

startServer();


