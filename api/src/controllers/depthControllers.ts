import {Request,Response} from 'express'
import DepthService from '../services/depthService';
class DepthControllerClass{
    
    async getDepth(req:Request,res:Response){
        const symbol = req.query.symbol as string;
        DepthService.getDepth(symbol);
        return res.json({
            //TODO -> update it
            market:'yash'
        })
    }

}

const DepthController = new DepthControllerClass();
export default DepthController;