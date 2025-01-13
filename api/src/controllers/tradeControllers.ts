import {Request,Response} from 'express'
import TradeService from '../services/tradeService';
class TradeControllersClass{
    
    getTrades(req:Request,res:Response){
        const symbol = req.query.symbol as string;

        const response = TradeService.getTrades(symbol)

        return res.json({
            symbol:"market"
        })
    }
}

const TradeControllers = new TradeControllersClass();