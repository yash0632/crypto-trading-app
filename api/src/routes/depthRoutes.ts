import {Router,Request,Response} from 'express'
import DepthController from '../controllers/depthControllers';

const depthRouter =Router();

depthRouter.get('/',(req:Request,res:Response)=>{

    DepthController.getDepth(req,res);
})

export default depthRouter;