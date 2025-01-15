import {Router,Response,Request} from 'express';
import TradeControllers from '../controllers/tradeControllers';
const tradeRouter = Router();

tradeRouter.get("/",(req:Request,res:Response)=>{
    TradeControllers.getTrades(req,res);
})

export default tradeRouter;